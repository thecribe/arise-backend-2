/**
 * -----------------------------------------------------------------------------
 * File: training-certificate.service.js
 *
 * Description:
 * Applicant training certificate business logic.
 *
 * Responsibilities:
 * - Fetch training requirements and applicant certificates.
 * - Create, update, and delete certificates.
 * - Submit the training certificate section.
 * - Record applicant audit actions.
 *
 * Notes:
 * - sectionId is supplied by the frontend.
 * - All active requirements are mandatory.
 * - Additional certificates use requirementId: null.
 * - Manager functionality is excluded.
 * -----------------------------------------------------------------------------
 */

import { AUDIT_ACTIONS } from "../../../../common/constants/audit-actions.js";
import { AUDIT_ENTITY_TYPES } from "../../../../common/constants/audit-entity-types.js";
import { ConflictError } from "../../../../common/errors/conflict-error.js";
import { NotFoundError } from "../../../../common/errors/not-found-error.js";
import { sequelize } from "../../../../config/database.js";
import { recordAuditAction } from "../../../audit/record-audit-action.js";
import { trainingCertificateRepository } from "./training-certificate.repository.js";

const EDITABLE_STATUSES = ["in_progress", "rejected"];

/**
 * -----------------------------------------------------------------------------
 * Ensure the applicant's application exists.
 * -----------------------------------------------------------------------------
 */
const ensureApplicantApplication = async (applicantId, transaction) => {
  const application =
    await trainingCertificateRepository.findApplicationByApplicantId(
      applicantId,
      { transaction },
    );

  if (!application) {
    throw new NotFoundError("Applicant application not found.");
  }

  return application;
};

/**
 * -----------------------------------------------------------------------------
 * Ensure the application section exists.
 * -----------------------------------------------------------------------------
 */
const ensureApplicationSection = async (
  applicationId,
  sectionId,
  transaction,
) => {
  const section =
    await trainingCertificateRepository.findSectionByApplicationId(
      applicationId,
      sectionId,
      { transaction },
    );

  if (!section) {
    throw new NotFoundError("Application section not found.");
  }

  return section;
};

/**
 * -----------------------------------------------------------------------------
 * Ensure the section can be edited.
 * -----------------------------------------------------------------------------
 */
const ensureEditableSection = (section) => {
  if (!EDITABLE_STATUSES.includes(section.status)) {
    throw new ConflictError(
      `This section cannot be modified while its status is "${section.status}".`,
    );
  }
};

/**
 * -----------------------------------------------------------------------------
 * Map certificate payload to database fields.
 * -----------------------------------------------------------------------------
 */
const mapCertificatePayload = (values) => ({
  requirement_id: values.requirementId ?? null,
  certificate_name: values.certificateName,
  certificate_number: values.certificateNumber ?? null,
  issue_date: values.issueDate ?? null,
  expiry_date: values.expiryDate ?? null,
  document: values.document ?? null,
});

/**
 * -----------------------------------------------------------------------------
 * GET applicant training certificates.
 * -----------------------------------------------------------------------------
 */
const getApplicantTrainingCertificates = async (applicantId, sectionId) => {
  const application = await ensureApplicantApplication(applicantId);

  const [requirements, certificates, section, comments] = await Promise.all([
    trainingCertificateRepository.findActiveRequirements(),

    trainingCertificateRepository.findCertificatesByApplicationId(
      application.id,
    ),

    trainingCertificateRepository.findSectionByApplicationId(
      application.id,
      sectionId,
    ),

    trainingCertificateRepository.findSectionReviewComments(
      application.id,
      sectionId,
    ),
  ]);

  if (!section) {
    throw new NotFoundError("Application section not found.");
  }

  return {
    sectionId,
    status: section.status,
    requirements,
    certificates,
    comments,
  };
};

/**
 * -----------------------------------------------------------------------------
 * GET applicant training certificate by ID.
 * -----------------------------------------------------------------------------
 */
const getApplicantTrainingCertificateById = async (
  applicantId,
  sectionId,
  certificateId,
) => {
  const application = await ensureApplicantApplication(applicantId);

  const section = await ensureApplicationSection(application.id, sectionId);

  const certificate = await trainingCertificateRepository.findCertificateById(
    certificateId,
    application.id,
  );

  if (!certificate) {
    throw new NotFoundError("Training certificate not found.");
  }

  return {
    sectionId,
    status: section.status,
    certificate,
  };
};

/**
 * -----------------------------------------------------------------------------
 * POST - Create training certificate.
 * -----------------------------------------------------------------------------
 */
const createTrainingCertificate = async (
  applicantId,
  sectionId,
  values,
  auditContext = {},
) => {
  return sequelize.transaction(async (transaction) => {
    const application = await ensureApplicantApplication(
      applicantId,
      transaction,
    );

    const section = await ensureApplicationSection(
      application.id,
      sectionId,
      transaction,
    );

    ensureEditableSection(section);

    const certificate = await trainingCertificateRepository.createCertificate(
      {
        application_id: application.id,
        uploaded_by: applicantId,
        ...mapCertificatePayload(values),
      },
      { transaction },
    );

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.TRAINING_CERTIFICATE_CREATED,
      entityType: AUDIT_ENTITY_TYPES.TRAINING_CERTIFICATE,
      entityId: certificate.id,
      applicationId: application.id,
      previousData: null,
      newData: certificate.toJSON(),
      metadata: {
        sectionId,
        sectionType: "applicant",
        applicationSectionId: section.id,
      },
      options: { transaction },
    });

    return certificate;
  });
};

/**
 * -----------------------------------------------------------------------------
 * PATCH - Update training certificate.
 * -----------------------------------------------------------------------------
 */
const updateTrainingCertificate = async (
  applicantId,
  sectionId,
  certificateId,
  values,
  auditContext = {},
) => {
  return sequelize.transaction(async (transaction) => {
    const application = await ensureApplicantApplication(
      applicantId,
      transaction,
    );

    const section = await ensureApplicationSection(
      application.id,
      sectionId,
      transaction,
    );

    ensureEditableSection(section);

    const certificate = await trainingCertificateRepository.findCertificateById(
      certificateId,
      application.id,
      { transaction },
    );

    if (!certificate) {
      throw new NotFoundError("Training certificate not found.");
    }

    const previousData = certificate.toJSON();

    await trainingCertificateRepository.updateCertificate(
      certificate,
      mapCertificatePayload(values),
      { transaction },
    );

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.TRAINING_CERTIFICATE_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.TRAINING_CERTIFICATE,
      entityId: certificate.id,
      applicationId: application.id,
      previousData,
      newData: certificate.toJSON(),
      metadata: {
        sectionId,
        sectionType: "applicant",
        applicationSectionId: section.id,
      },
      options: { transaction },
    });

    return certificate;
  });
};

/**
 * -----------------------------------------------------------------------------
 * DELETE - Delete training certificate.
 * -----------------------------------------------------------------------------
 */
const deleteTrainingCertificate = async (
  applicantId,
  sectionId,
  certificateId,
  auditContext = {},
) => {
  return sequelize.transaction(async (transaction) => {
    const application = await ensureApplicantApplication(
      applicantId,
      transaction,
    );

    const section = await ensureApplicationSection(
      application.id,
      sectionId,
      transaction,
    );

    ensureEditableSection(section);

    const certificate = await trainingCertificateRepository.findCertificateById(
      certificateId,
      application.id,
      { transaction },
    );

    if (!certificate) {
      throw new NotFoundError("Training certificate not found.");
    }

    const previousData = certificate.toJSON();

    await trainingCertificateRepository.deleteCertificate(certificate, {
      transaction,
    });

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.TRAINING_CERTIFICATE_DELETED,
      entityType: AUDIT_ENTITY_TYPES.TRAINING_CERTIFICATE,
      entityId: certificate.id,
      applicationId: application.id,
      previousData,
      newData: null,
      metadata: {
        sectionId,
        sectionType: "applicant",
        applicationSectionId: section.id,
      },
      options: { transaction },
    });

    return {
      id: certificateId,
      deleted: true,
    };
  });
};

/**
 * -----------------------------------------------------------------------------
 * POST - Submit training certificate section.
 * -----------------------------------------------------------------------------
 */
const submitTrainingCertificates = async (
  applicantId,
  sectionId,
  auditContext = {},
) => {
  return sequelize.transaction(async (transaction) => {
    const application = await ensureApplicantApplication(
      applicantId,
      transaction,
    );

    const section = await ensureApplicationSection(
      application.id,
      sectionId,
      transaction,
    );

    ensureEditableSection(section);

    const [requirements, certificates] = await Promise.all([
      trainingCertificateRepository.findActiveRequirements({
        transaction,
      }),

      trainingCertificateRepository.findCertificatesByApplicationId(
        application.id,
        { transaction },
      ),
    ]);

    const submittedRequirementIds = new Set(
      certificates
        .filter((certificate) => certificate.requirement_id)
        .map((certificate) => certificate.requirement_id),
    );

    const missingRequirements = requirements.filter(
      (requirement) => !submittedRequirementIds.has(requirement.id),
    );

    if (missingRequirements.length > 0) {
      throw new ConflictError(
        "All mandatory training certificates must be provided before submission.",
      );
    }

    const previousData = {
      status: section.status,
      submitted_at: section.submitted_at,
    };

    await trainingCertificateRepository.updateSectionStatus(
      section,
      {
        status: "submitted",
        submitted_at: new Date(),
      },
      { transaction },
    );

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.APPLICATION_SECTION_SUBMITTED,
      entityType: AUDIT_ENTITY_TYPES.APPLICATION_SECTION,
      entityId: section.id,
      applicationId: application.id,
      previousData,
      newData: {
        status: "submitted",
        submitted_at: section.submitted_at,
      },
      metadata: {
        sectionId,
        sectionType: "applicant",
        applicationSectionId: section.id,
      },
      options: { transaction },
    });

    return {
      sectionId,
      status: "submitted",
    };
  });
};

export default {
  getApplicantTrainingCertificates,
  getApplicantTrainingCertificateById,
  createTrainingCertificate,
  updateTrainingCertificate,
  deleteTrainingCertificate,
  submitTrainingCertificates,
};
