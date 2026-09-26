import { AUDIT_ACTIONS } from "../../../../common/constants/audit-actions.js";
import { AUDIT_ENTITY_TYPES } from "../../../../common/constants/audit-entity-types.js";
import { NotFoundError } from "../../../../common/errors/not-found-error.js";
import { sequelize } from "../../../../config/database.js";
import { recordAuditAction } from "../../../audit/record-audit-action.js";
import { ensureApplicationSection } from "../../../recruitment/compliance.service.js";
import { applicantComplianceRepository } from "./applicant-complaince-forms.repository.js";

const EDITABLE_STATUSES = ["in_progress", "rejected"];

/**
 * Parse stored section values.
 */
const parseValues = (values) => {
  if (!values) {
    return {};
  }

  if (typeof values === "object") {
    return values;
  }

  try {
    return JSON.parse(values);
  } catch {
    return {};
  }
};

/**
 * Resolve an applicant's application.
 *
 * The applicant ID comes from req.user.id.
 */
const getApplicantApplication = async (applicantId, options = {}) => {
  const application =
    await applicantComplianceRepository.findApplicationByApplicantId(
      applicantId,
      options,
    );

  if (!application) {
    throw new NotFoundError("Applicant application not found.");
  }

  return application;
};

/**
 * Validate that a section belongs to the applicant's application.
 */
const getApplicantSection = async (
  applicantId,
  sectionId,
  options = {},
  auditContext,
) => {
  const application = await getApplicantApplication(applicantId, options);

  const section =
    await applicantComplianceRepository.findSectionByApplicationIdAndSectionId(
      application.id,
      sectionId,
      options,
    );

  if (!section) {
    throw new NotFoundError("Applicant compliance section not found.");
  }

  return {
    application,
    section,
  };
};

/**
 * Retrieve all compliance section statuses.
 */
const getSections = async (applicantId, auditContext) => {
  const application = await getApplicantApplication(applicantId);
  await ensureApplicationSection(application.id, null, auditContext);
  return applicantComplianceRepository.findSectionsByApplicationId(
    application.id,
  );
};

/**
 * Retrieve a compliance section with its values and comments.
 */
const getSection = async (applicantId, sectionId, auditContext) => {
  const { application, section } = await getApplicantSection(
    applicantId,
    sectionId,
    {},
    auditContext,
  );

  const [values, comments] = await Promise.all([
    applicantComplianceRepository.findValuesByApplicationIdAndSectionId(
      application.id,
      sectionId,
    ),

    applicantComplianceRepository.findCommentsByApplicationIdAndSectionId(
      application.id,
      sectionId,
    ),
  ]);

  return {
    section,
    values: parseValues(values?.values),
    comments,
  };
};

/**
 * Save a compliance section draft.
 */
const saveDraft = async (
  applicantId,
  sectionId,
  submittedValues,
  auditContext,
) => {
  return sequelize.transaction(async (transaction) => {
    const { application, section } = await getApplicantSection(
      applicantId,
      sectionId,
      { transaction },
    );

    if (!EDITABLE_STATUSES.includes(section.status)) {
      throw new Error(
        "This compliance section cannot be edited in its current status.",
      );
    }

    const previousData = {
      status: section.status,
      values: null,
    };

    const existingValues =
      await applicantComplianceRepository.findValuesByApplicationIdAndSectionId(
        application.id,
        sectionId,
        { transaction },
      );

    const valuesData = {
      application_id: application.id,
      section_id: sectionId,
      values: JSON.stringify(submittedValues ?? {}),
    };

    if (existingValues) {
      await applicantComplianceRepository.updateValues(
        existingValues,
        valuesData,
        { transaction },
      );
    } else {
      await applicantComplianceRepository.createValues(valuesData, {
        transaction,
      });
    }

    const newData = {
      status: section.status,
      values: submittedValues ?? {},
    };

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.APPLICATION_SECTION_DRAFT_SAVED,
      entityType: AUDIT_ENTITY_TYPES.APPLICATION_SECTION,
      entityId: section.id,
      applicationId: application.id,
      previousData,
      newData,
      metadata: {
        feature: "applicant-compliance",
        operation: "save-draft",
        sectionId,
      },
      options: {
        transaction,
      },
    });

    return {
      section,
      values: submittedValues ?? {},
    };
  });
};

/**
 * Submit a compliance section.
 */
const submitSection = async (
  applicantId,
  sectionId,
  submittedValues,
  auditContext,
) => {
  return sequelize.transaction(async (transaction) => {
    const { application, section } = await getApplicantSection(
      applicantId,
      sectionId,
      { transaction },
    );

    if (!EDITABLE_STATUSES.includes(section.status)) {
      throw new Error(
        "This compliance section cannot be submitted in its current status.",
      );
    }

    const previousData = {
      status: section.status,
    };

    const existingValues =
      await applicantComplianceRepository.findValuesByApplicationIdAndSectionId(
        application.id,
        sectionId,
        { transaction },
      );

    const valuesData = {
      application_id: application.id,
      section_id: sectionId,
      values: JSON.stringify(submittedValues ?? {}),
    };

    if (existingValues) {
      await applicantComplianceRepository.updateValues(
        existingValues,
        valuesData,
        { transaction },
      );
    } else {
      await applicantComplianceRepository.createValues(valuesData, {
        transaction,
      });
    }

    await applicantComplianceRepository.updateSection(
      section,
      {
        status: "submitted",
        submitted_at: new Date(),
        approved_at: null,
      },
      { transaction },
    );

    const newData = {
      status: "submitted",
      submittedAt: section.submitted_at,
    };

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.APPLICATION_SECTION_SUBMITTED,
      entityType: AUDIT_ENTITY_TYPES.APPLICATION_SECTION,
      entityId: section.id,
      applicationId: application.id,
      previousData,
      newData,
      metadata: {
        feature: "applicant-compliance",
        operation: "submit-section",
        sectionId,
      },
      options: {
        transaction,
      },
    });

    return {
      section,
      values: submittedValues ?? {},
    };
  });
};

export const applicantComplianceService = {
  getSections,
  getSection,
  saveDraft,
  submitSection,
};
