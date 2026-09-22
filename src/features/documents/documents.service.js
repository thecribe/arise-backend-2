/**
 * -----------------------------------------------------------------------------
 * File: documents.service.js
 *
 * Description:
 * Prepares application data for frontend-generated documents.
 * -----------------------------------------------------------------------------
 */

import { NotFoundError } from "../../common/errors/not-found-error.js";

import {
  findApplicationById,
  findApplicationSections,
  findSectionValues,
} from "../applicant-application/applicant-application.repository.js";
import { referenceRepository } from "../reference/reference.repository.js";

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

export default {
  getApplicationFormDocumentData,
};
