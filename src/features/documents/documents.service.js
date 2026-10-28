/**
 * -----------------------------------------------------------------------------
 * File: documents.service.js
 *
 * Description:
 * Prepares application data for frontend-generated documents.
 * -----------------------------------------------------------------------------
 */

import { NotFoundError } from "../../common/errors/not-found-error.js";
import { sequelize } from "../../config/database.js";

import {
  findApplicationById,
  findApplicationSections,
  findSectionValues,
} from "../applicant-application/applicant-application.repository.js";
import { interviewRepository } from "../interview/applicant-interview.repository.js";
import interviewDefinitionService from "../interview/definition/interview-definition.service.js";
import { referenceRepository } from "../reference/reference.repository.js";
import documentsRepository from "./documents.repository.js";

const parseJsonValue = (value, fallback = null) => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const convertToPlainObject = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value.toJSON === "function") {
    return value.toJSON();
  }

  return { ...value };
};

const sanitizeApplicant = (applicant) => {
  const plainApplicant = convertToPlainObject(applicant);

  if (!plainApplicant) {
    return null;
  }

  const {
    password,
    passwordHash,
    refreshToken,
    resetToken,
    verificationToken,
    ...safeApplicant
  } = plainApplicant;

  return safeApplicant;
};

const getSectionStatusMap = (sections = []) => {
  return new Map(
    sections.map((section) => [
      section.section_id,
      convertToPlainObject(section),
    ]),
  );
};

const prepareSection = async ({ applicationId, sectionId, sectionStatus }) => {
  const sectionValueRecord = await findSectionValues(applicationId, sectionId);

  return {
    sectionId,

    status: sectionStatus?.status ?? "locked",

    recruiterComment: sectionStatus?.recruiter_comment ?? null,

    submittedAt: sectionStatus?.submitted_at ?? null,

    approvedAt: sectionStatus?.approved_at ?? null,

    values: parseJsonValue(sectionValueRecord?.values, {}),
  };
};

const getApplicationFormDocumentData = async (applicationId) => {
  const application = await findApplicationById(applicationId);

  if (!application) {
    throw new NotFoundError("Application not found.");
  }

  const [applicationSections, references] = await Promise.all([
    findApplicationSections(applicationId),

    referenceRepository.findReferencesByApplicationId(applicationId),
  ]);

  const sectionStatusMap = getSectionStatusMap(applicationSections);

  /**
   * Only return sections belonging to the Application Form.
   *
   * The frontend will request the definitions separately through:
   * GET /application-definitions/phases/:phaseId/sections
   */
  const applicationFormSectionIds = [
    "personal-information",
    "address-contact-information",
    "employment-history",
    "educational-qualification",
    "upload-cv",
  ];

  const sections = await Promise.all(
    applicationFormSectionIds.map((sectionId) =>
      prepareSection({
        applicationId,
        sectionId,
        sectionStatus: sectionStatusMap.get(sectionId),
      }),
    ),
  );

  return {
    documentType: "application_form",

    application: {
      id: application.id,
      status: application.status ?? null,
      createdAt: application.created_at ?? null,
      updatedAt: application.updated_at ?? null,
    },

    applicant: sanitizeApplicant(application.applicant),

    sections,

    references: references.map((reference) => convertToPlainObject(reference)),

    generatedAt: new Date().toISOString(),
  };
};

/**
 * -----------------------------------------------------------------------------
 * File: interview-document.service.js
 *
 * Description:
 * Prepares interview data for the Interview Scoresheet PDF.
 * -----------------------------------------------------------------------------
 */

/**
 * Safely converts a value to a number.
 */
const toNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : null;
};

/**
 * Safely retrieves a nested value using a dot-separated path.
 *
 * Example:
 * scores.spokenEnglishCompetency
 */
const getNestedValue = (object, path) => {
  if (!object || typeof object !== "object") {
    return null;
  }

  const normalizedPath = path.startsWith("scores.")
    ? path.replace("scores.", "")
    : path;

  return normalizedPath.split(".").reduce((currentValue, key) => {
    if (
      currentValue === null ||
      currentValue === undefined ||
      typeof currentValue !== "object"
    ) {
      return null;
    }

    return currentValue[key];
  }, object);
};

/**
 * Extracts the applicant's full name.
 *
 * Adjust the field names if your User model uses different names.
 */
const getApplicantFullName = (applicant) => {
  if (!applicant) {
    return null;
  }

  const firstName = applicant.first_name ?? "";
  const lastName = applicant.last_name ?? "";

  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || applicant.name || null;
};

/**
 * Formats a single interview section.
 */
const formatInterviewSection = (section, scores) => {
  const sortedFields = [...section.fields].sort(
    (firstField, secondField) => firstField.order - secondField.order,
  );

  return {
    id: section.id,
    title: section.title,
    description: section.description ?? null,
    order: section.order,

    fields: sortedFields.map((field) => {
      const fieldValue = getNestedValue(scores, field.name);

      return {
        id: field.id,
        name: field.name,
        label: field.label,
        type: field.type,

        description: field.helpText ?? null,

        required: field.required ?? false,
        min: field.min ?? null,
        max: field.max ?? null,
        order: field.order,

        score: toNumber(fieldValue),
      };
    }),
  };
};

/**
 * Formats applicant details for the PDF.
 *
 * Only expose the applicant details required by the document.
 */
const formatApplicant = (applicant) => {
  if (!applicant) {
    return null;
  }

  return {
    id: applicant.id ?? null,
    fullName: getApplicantFullName(applicant),
  };
};

/**
 * Retrieves and formats the Interview Scoresheet document.
 *
 
 */
const getInterviewDocument = async (applicationId) => {
  if (!applicationId) {
    throw new Error("Application ID is required.");
  }

  const [interview, application] = await Promise.all([
    interviewRepository.findInterviewByApplicationId(applicationId),

    findApplicationById(applicationId),
  ]);

  if (!application) {
    throw new Error("Application not found.");
  }

  if (!interview) {
    return null;
  }

  const sections = interviewDefinitionService.getInterviewSections();

  const formattedSections = sections.map((section) =>
    formatInterviewSection(section, interview.scores),
  );

  return {
    documentType: "interview_scoresheet",

    applicant: formatApplicant(application.applicant),

    interview: {
      id: interview.id,
      applicationId: interview.application_id,

      interviewerId: interview.interviewer_id,
      interviewerName: interview.interviewer_name,

      interviewDate: interview.interview_date,

      interviewerSignature: interview.interviewer_signature
        ? JSON.parse(interview.interviewer_signature)
        : null,

      normalizedScore: toNumber(interview.normalized_score),

      totalScore: 50,
    },

    sections: formattedSections,

    generatedAt: new Date().toISOString(),
  };
};

const COMPLIANCE_SECTION_IDS = {
  identityCompliance: "identity-compliance",
  rightToWork: "right-to-work",
  dbs: "dbs",
  professionalMemberships: "professional-memberships",
};

const parseSectionValues = (record) => {
  if (!record) {
    return {};
  }

  const rawValues = record.values;

  if (!rawValues) {
    return {};
  }

  if (typeof rawValues === "object") {
    return rawValues;
  }

  try {
    return JSON.parse(rawValues);
  } catch {
    return {};
  }
};

const toPlainObject = (record) => {
  if (!record) {
    return null;
  }

  return typeof record.toJSON === "function" ? record.toJSON() : { ...record };
};

const getSectionValuesMap = (records = []) => {
  return records.reduce((result, record) => {
    result[record.section_id] = parseSectionValues(record);
    return result;
  }, {});
};

const getComplianceSectionStatusMap = (sections = []) => {
  return sections.reduce((result, section) => {
    result[section.sectionId ?? section.section_id] =
      section.status ?? "not_started";

    return result;
  }, {});
};

const getComplianceSummaryDocumentData = async (applicationId) => {
  return sequelize.transaction(async (transaction) => {
    const application = await findApplicationById(applicationId);

    if (!application) {
      throw new NotFoundError("Application not found.");
    }

    const [
      applicationSections,
      applicantSectionRecords,
      managerSectionRecords,
      certificateRecords,
      requirementRecords,
      referenceRecords,
    ] = await Promise.all([
      findApplicationSections(applicationId),
      documentsRepository.findApplicantSectionValues(
        applicationId,
        Object.values(COMPLIANCE_SECTION_IDS),
        transaction,
      ),
      documentsRepository.findManagerSectionValues(
        applicationId,
        Object.values(COMPLIANCE_SECTION_IDS),
        transaction,
      ),
      documentsRepository.findTrainingCertificatesByApplicationId(
        applicationId,
        transaction,
      ),
      documentsRepository.findActiveTrainingCertificateRequirements(
        transaction,
      ),
      documentsRepository.findReferencesByApplicationId(
        applicationId,
        transaction,
      ),
    ]);

    const referenceIds = referenceRecords.map((reference) => reference.id);

    const referenceResponseRecords =
      await documentsRepository.findReferenceResponsesByReferenceIds(
        referenceIds,
        transaction,
      );

    const applicantValuesMap = getSectionValuesMap(applicantSectionRecords);
    const managerValuesMap = getSectionValuesMap(managerSectionRecords);
    const sectionStatusMap = getComplianceSectionStatusMap(applicationSections);

    const certificates = certificateRecords.map((record) =>
      toPlainObject(record),
    );

    const requirements = requirementRecords.map((record) =>
      toPlainObject(record),
    );

    const uploadedRequirementIds = new Set(
      certificates
        .map((certificate) => certificate.requirement_id)
        .filter(Boolean)
        .map(String),
    );

    const missingMandatoryRequirements = requirements
      .filter(
        (requirement) => !uploadedRequirementIds.has(String(requirement.id)),
      )
      .map((requirement) => ({
        id: requirement.id,
        name: requirement.name,
        description: requirement.description,
        status: "missing",
      }));

    const responsesByReferenceId = new Map();

    for (const responseRecord of referenceResponseRecords) {
      const response = toPlainObject(responseRecord);
      const key = String(response.referenceId ?? response.reference_id);

      if (!responsesByReferenceId.has(key)) {
        responsesByReferenceId.set(key, []);
      }

      responsesByReferenceId.get(key).push(response);
    }

    const references = referenceRecords.map((referenceRecord) => {
      const reference = toPlainObject(referenceRecord);
      const referenceId = String(reference.id);
      const responses = responsesByReferenceId.get(referenceId) ?? [];

      return {
        ...reference,
        responseStatus: responses.length > 0 ? "received" : "pending",
        responses,
      };
    });

    const applicant = toPlainObject(application.applicant);

    return {
      documentType: "compliance_summary",
      generatedAt: new Date().toISOString(),

      application: {
        id: application.id,
        status: application.status,
        submittedAt: application.submittedAt ?? application.submitted_at,
      },

      applicant: sanitizeApplicant(applicant),

      sections: {
        identityCompliance: {
          sectionId: COMPLIANCE_SECTION_IDS.identityCompliance,
          status:
            sectionStatusMap[COMPLIANCE_SECTION_IDS.identityCompliance] ??
            "not_started",
          values:
            applicantValuesMap[COMPLIANCE_SECTION_IDS.identityCompliance] ?? {},
        },

        rightToWork: {
          sectionId: COMPLIANCE_SECTION_IDS.rightToWork,
          status:
            sectionStatusMap[COMPLIANCE_SECTION_IDS.rightToWork] ??
            "not_started",
          applicantValues:
            applicantValuesMap[COMPLIANCE_SECTION_IDS.rightToWork] ?? {},
          managerValues:
            managerValuesMap[COMPLIANCE_SECTION_IDS.rightToWork] ?? {},
        },

        dbs: {
          sectionId: COMPLIANCE_SECTION_IDS.dbs,
          status: sectionStatusMap[COMPLIANCE_SECTION_IDS.dbs] ?? "not_started",
          managerValues: managerValuesMap[COMPLIANCE_SECTION_IDS.dbs] ?? {},
        },

        professionalMemberships: {
          sectionId: COMPLIANCE_SECTION_IDS.professionalMemberships,
          status:
            sectionStatusMap[COMPLIANCE_SECTION_IDS.professionalMemberships] ??
            "not_started",
          values:
            applicantValuesMap[
              COMPLIANCE_SECTION_IDS.professionalMemberships
            ] ?? {},
        },
      },

      trainingCertificates: {
        uploaded: certificates,
        missingMandatoryRequirements,
      },

      references,

      summary: {
        uploadedCertificateCount: certificates.length,
        missingMandatoryCertificateCount: missingMandatoryRequirements.length,
        totalReferences: references.length,
        receivedReferenceResponses: references.filter(
          (reference) => reference.responseStatus === "received",
        ).length,
        pendingReferenceResponses: references.filter(
          (reference) => reference.responseStatus === "pending",
        ).length,
      },
    };
  });
};

export default {
  getInterviewDocument,
  getApplicationFormDocumentData,
  getComplianceSummaryDocumentData,
};
