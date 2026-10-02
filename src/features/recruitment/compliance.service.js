import { recruitmentRepository } from "./recruitment.repository.js";
import {
  createApplicationSection,
  createSectionValues,
  findSectionValues,
  updateSectionValues,
} from "../applicant-application/applicant-application.repository.js";
import { AUDIT_ACTIONS } from "../../common/constants/audit-actions.js";
import { AUDIT_ENTITY_TYPES } from "../../common/constants/audit-entity-types.js";
import { recordAuditAction } from "../audit/record-audit-action.js";
import { NotFoundError } from "../../common/errors/not-found-error.js";
import { sequelize } from "../../config/database.js";
import { ConflictError } from "../../common/errors/conflict-error.js";
import { COMPLIANCE_FIELDS } from "../compliance/applicant-compliance/forms/forms.js";
import { BadRequestError } from "../../common/errors/bad-request-error.js";
import { formatDbsResponse } from "../../common/utils/dbs-xml-parser.js";
import { env } from "../../config/env.js";

export const ensureApplicationSection = async (
  applicationId,
  sectionId,
  auditContext,
  options = {},
) => {
  // Sections that must exist
  const requiredSectionIds = [
    sectionId && sectionId,
    ...COMPLIANCE_FIELDS,
  ].filter(Boolean);

  // Remove duplicates
  const uniqueSectionIds = [...new Set(requiredSectionIds)];

  for (const currentSectionId of uniqueSectionIds) {
    const existingSection = await recruitmentRepository.findApplicationSection({
      applicationId,
      sectionId: currentSectionId,
      options,
    });

    if (!existingSection) {
      await createApplicationSection(
        {
          application_id: applicationId,
          section_id: currentSectionId,
          status: "in_progress",
        },
        options,
      );
    }
  }

  let section = await recruitmentRepository.findApplicationSection({
    applicationId,
    sectionId,
    options,
  });

  // if (section) {
  //   return section;
  // }

  // section = await createApplicationSection(
  //   {
  //     application_id: applicationId,
  //     section_id: sectionId,
  //     status: "in_progress",
  //   },
  //   options,
  // );

  await recordAuditAction({
    auditContext,
    action: AUDIT_ACTIONS.APPLICATION_SECTION_CREATED,
    entityType: AUDIT_ENTITY_TYPES.APPLICATION_SECTION,
    entityId: section ? section.id : "Initialize",
    applicationId,
    newData: {
      section_id: sectionId,
      status: section ? section.status : "in_progress",
    },
    options,
  });

  return section;
};

const getComplianceSection = async (
  applicationId,
  sectionId,
  auditContext = {},
) => {
  return sequelize.transaction(async (transaction) => {
    const application =
      await recruitmentRepository.findApplicantApplicationByApplicationId(
        applicationId,
        {
          transaction,
        },
      );

    if (!application) {
      throw new NotFoundError("Applicant application not found.");
    }

    await ensureApplicationSection(applicationId, sectionId, auditContext, {
      transaction,
    });

    const details = await recruitmentRepository.findApplicationSectionDetails(
      applicationId,
      sectionId,
      { transaction },
    );

    if (!details) {
      throw new NotFoundError("Application section not found.");
    }

    return {
      applicant: {
        values: details.sectionValues?.values
          ? JSON.parse(details.sectionValues.values)
          : {},
      },

      manager: {
        values: details.managerSectionValues?.values
          ? JSON.parse(details.managerSectionValues.values)
          : {},
      },

      comments: details.comments.map((comment) => {
        const data = comment.get({ plain: true });

        return {
          id: data.id,
          comment: data.comment,
          application_id: data.application_id,
          section_id: data.section_id,
          createdBy: {
            id: data.creator?.id,
            name: [data.creator?.first_name, data.creator?.last_name]
              .filter(Boolean)
              .join(" "),
          },
          createdAt: data.createdAt,
        };
      }),

      progress: details.section.status,
    };
  });
};

const updateComplianceSectionData = async (
  applicationId,
  sectionId,
  values,
  auditContext = {},
) => {
  return sequelize.transaction(async (transaction) => {
    const application =
      await recruitmentRepository.findApplicantApplicationByApplicationId(
        applicationId,
        {
          transaction,
        },
      );

    if (!application) {
      throw new NotFoundError("Applicant application not found.");
    }

    const section = await ensureApplicationSection(
      applicationId,
      sectionId,
      auditContext,
      { transaction },
    );

    if (section.status === "approved") {
      throw new ConflictError(
        "This application section has already been approved.",
      );
    }
    let sectionValues = await findSectionValues(applicationId, sectionId, {
      transaction,
    });

    const previousValues = sectionValues?.values ?? null;

    const payload = {
      application_id: applicationId,
      section_id: sectionId,
      values: JSON.stringify(values),
    };

    if (sectionValues) {
      sectionValues = await updateSectionValues(
        sectionValues,
        {
          values: payload.values,
        },
        { transaction },
      );
    } else {
      sectionValues = await createSectionValues(payload, {
        transaction,
      });
    }

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.APPLICATION_SECTION_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.COMPLIANCE,
      entityId: sectionId,
      applicationId,
      previousData: {
        values: previousValues,
      },
      newData: {
        values,
      },
      metadata: {
        sectionId,
        sectionType: "applicant",
        applicationSectionId: section.id,
      },
      options: { transaction },
    });

    return values;
  });
};

const updateComplianceManagerSectionData = async (
  applicationId,
  sectionId,
  values,
  auditContext = {},
) => {
  return sequelize.transaction(async (transaction) => {
    const application =
      await recruitmentRepository.findApplicantApplicationByApplicationId(
        applicationId,
        {
          transaction,
        },
      );

    if (!application) {
      throw new NotFoundError("Applicant application not found.");
    }

    const section = await ensureApplicationSection(
      applicationId,
      sectionId,
      auditContext,
      { transaction },
    );

    let managerSectionValues =
      await recruitmentRepository.findManagerSectionValues(
        applicationId,
        sectionId,
        { transaction },
      );

    const previousValues = managerSectionValues?.values ?? null;

    const payload = {
      application_id: applicationId,
      section_id: sectionId,
      values: JSON.stringify(values),
    };

    if (managerSectionValues) {
      managerSectionValues =
        await recruitmentRepository.updateManagerSectionValues(
          managerSectionValues,
          {
            values: payload.values,
          },
          { transaction },
        );
    } else {
      managerSectionValues =
        await recruitmentRepository.createManagerSectionValues(payload, {
          transaction,
        });
    }

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.APPLICATION_SECTION_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.COMPLIANCE,
      entityId: sectionId,
      applicationId,
      previousData: {
        values: previousValues,
      },
      newData: {
        values,
      },
      metadata: {
        sectionId,
        sectionType: "manager",
        applicationSectionId: section.id,
      },
      options: { transaction },
    });

    return values;
  });
};

const verifyDbsCompliance = async (
  applicationId,
  values,
  auditContext = {},
) => {
  const { disclosureNumber, dateOfBirth, surname } = values;

  const canVerifyDbs = [disclosureNumber, dateOfBirth, surname].every(
    (value) => typeof value === "string" && value.trim().length > 0,
  );

  if (!canVerifyDbs) {
    throw new NotFoundError("Some of the required details not available");
  }

  const url = new URL(
    `https://secure.crbonline.gov.uk/crsc/api/status/${encodeURIComponent(
      disclosureNumber.trim(),
    )}`,
  );

  const [year, month, day] = dateOfBirth.trim().split("-");

  url.search = new URLSearchParams({
    dateOfBirth: `${day}/${month}/${year}`,
    surname: surname.trim().toUpperCase(),
    hasAgreedTermsAndConditions: "true",
    organisationName: "Arise Nursing",
    employeeSurname: "Oteri",
    employeeForename: "Layo",
  }).toString();

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new BadRequestError(
        `DBS verification failed with status ${response.status}`,
      );
    }

    const data = formatDbsResponse(responseText);

    return data;
  } catch (error) {
    throw error;
  }
};
const verifyRTWCompliance = async (
  applicationId,
  values,
  auditContext = {},
) => {
  const { shareCode, dateOfBirth } = values;

  const canVerifyDbs = [shareCode, dateOfBirth].every(
    (value) => typeof value === "string" && value.trim().length > 0,
  );

  if (!canVerifyDbs) {
    throw new NotFoundError("Some of the required details not available");
  }

  const [year, month, day] = dateOfBirth.trim().split("-");

  try {
    const res = await fetch(
      "https://checksharecode.co.uk/api/check/right-to-work",
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${env.RTW_API}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          share_code: shareCode.replace(/\s+/g, ""),
          date_of_birth: `${year}-${month}-${day}`,
          company_name: "Arise Nursing",
        }),
      },
    );

    const result = await res.json();

    if (!res.ok) {
      throw new BadRequestError(
        `${result.error.code}: ${result.error.message}`,
      );
    }

    // const data = formatDbsResponse(responseText);

    return result;
  } catch (error) {
    throw error;
  }
};

export {
  getComplianceSection,
  updateComplianceSectionData,
  updateComplianceManagerSectionData,
  verifyDbsCompliance,
  verifyRTWCompliance,
};
