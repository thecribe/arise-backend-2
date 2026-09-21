import { AUDIT_ACTIONS } from "../../../../common/constants/audit-actions.js";
import { AUDIT_ENTITY_TYPES } from "../../../../common/constants/audit-entity-types.js";
import { BadRequestError } from "../../../../common/errors/bad-request-error.js";
import { NotFoundError } from "../../../../common/errors/not-found-error.js";
import { sequelize } from "../../../../config/database.js";
import { recordAuditAction } from "../../../audit/record-audit-action.js";

import referenceRepository from "./applicant-complaince-reference.repository.js";

const EDITABLE_STATUSES = ["in_progress", "rejected"];

const SUBMITTABLE_STATUSES = ["in_progress", "rejected"];

const REFERENCE_FIELDS = [
  "companyName",
  "fromDate",
  "toDate",
  "refereeName",
  "refereeEmail",
  "refereePhone",
  "refereeRelationship",
];

/**
 * Restrict incoming data to permitted reference fields.
 */
const sanitizeReferenceData = (data = {}) => {
  return Object.fromEntries(
    REFERENCE_FIELDS.filter((field) => Object.hasOwn(data, field)).map(
      (field) => [field, data[field]],
    ),
  );
};

/**
 * Find the applicant's application.
 */
const getApplicantApplication = async (applicantId, options = {}) => {
  const application = await referenceRepository.findApplicationByApplicantId(
    applicantId,
    options,
  );

  if (!application) {
    throw new NotFoundError("Applicant application was not found.");
  }

  return application;
};

/**
 * Get all references for the applicant.
 *
 * Mail status is intentionally excluded.
 */
const getApplicantReferences = async (applicantId) => {
  const application = await getApplicantApplication(applicantId);

  return referenceRepository.findApplicantReferencesByApplicationId(
    application.id,
  );
};

/**
 * Get one reference for the applicant.
 *
 * Mail status is intentionally excluded.
 */
const getApplicantReferenceById = async (applicantId, referenceId) => {
  const application = await getApplicantApplication(applicantId);

  const reference = await referenceRepository.findReferenceById(
    referenceId,
    application.id,
  );

  if (!reference) {
    throw new NotFoundError("Reference was not found.");
  }

  return reference;
};

/**
 * Create a reference.
 *
 * New references always start as in_progress.
 * Mail status is created as Not sent by the repository.
 */
const createReference = async (applicantId, data, auditContext) => {
  const application = await getApplicantApplication(applicantId);

  const referenceData = sanitizeReferenceData(data);

  return sequelize.transaction(async (transaction) => {
    const reference = await referenceRepository.createReference(
      {
        applicationId: application.id,
        ...referenceData,
      },
      {
        transaction,
      },
    );

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.REFERENCE_CREATED,
      entityType: AUDIT_ENTITY_TYPES.REFERENCE,
      entityId: reference.id,
      applicationId: application.id,
      previousData: null,
      newData: reference.toJSON(),
      metadata: {
        status: "in_progress",
      },
      options: {
        transaction,
      },
    });

    return reference;
  });
};

/**
 * Update an individual reference.
 *
 * Only in_progress and rejected references can be edited.
 */
const updateReference = async (
  applicantId,
  referenceId,
  data,
  auditContext,
) => {
  const application = await getApplicantApplication(applicantId);

  return sequelize.transaction(async (transaction) => {
    const reference = await referenceRepository.findReferenceById(
      referenceId,
      application.id,
      {
        transaction,
        lock: transaction.LOCK.UPDATE,
      },
    );

    if (!reference) {
      throw new NotFoundError("Reference was not found.");
    }

    if (!EDITABLE_STATUSES.includes(reference.status)) {
      throw new BadRequestError(
        `A reference with status "${reference.status}" cannot be updated.`,
      );
    }

    const previousData = reference.toJSON();
    const referenceData = sanitizeReferenceData(data);

    await referenceRepository.updateReference(reference, referenceData, {
      transaction,
    });

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.REFERENCE_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.REFERENCE,
      entityId: reference.id,
      applicationId: application.id,
      previousData,
      newData: reference.toJSON(),
      options: {
        transaction,
      },
    });

    return reference;
  });
};

/**
 * Delete an individual reference.
 *
 * Only in_progress and rejected references can be deleted.
 */
const deleteReference = async (applicantId, referenceId, auditContext) => {
  const application = await getApplicantApplication(applicantId);

  return sequelize.transaction(async (transaction) => {
    const reference = await referenceRepository.findReferenceById(
      referenceId,
      application.id,
      {
        transaction,
        lock: transaction.LOCK.UPDATE,
      },
    );

    if (!reference) {
      throw new NotFoundError("Reference was not found.");
    }

    if (!EDITABLE_STATUSES.includes(reference.status)) {
      throw new BadRequestError(
        `A reference with status "${reference.status}" cannot be deleted.`,
      );
    }

    const previousData = reference.toJSON();

    await referenceRepository.deleteReference(reference, {
      transaction,
    });

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.REFERENCE_DELETED,
      entityType: AUDIT_ENTITY_TYPES.REFERENCE,
      entityId: reference.id,
      applicationId: application.id,
      previousData,
      newData: null,
      options: {
        transaction,
      },
    });

    return {
      id: referenceId,
      deleted: true,
    };
  });
};

/**
 * Submit all eligible references.
 *
 * in_progress and rejected -> submitted
 * submitted and approved remain unchanged.
 */
const submitReferences = async (applicantId, auditContext) => {
  const application = await getApplicantApplication(applicantId);

  return sequelize.transaction(async (transaction) => {
    const references =
      await referenceRepository.findApplicantReferencesByApplicationId(
        application.id,
        {
          transaction,
          lock: transaction.LOCK.UPDATE,
        },
      );

    const eligibleReferences = references.filter((reference) =>
      SUBMITTABLE_STATUSES.includes(reference.status),
    );

    if (eligibleReferences.length === 0) {
      return {
        submittedCount: 0,
        references,
      };
    }

    const previousData = eligibleReferences.map((reference) =>
      reference.toJSON(),
    );

    await referenceRepository.submitEligibleReferences(application.id, {
      transaction,
    });

    const updatedReferences =
      await referenceRepository.findApplicantReferencesByApplicationId(
        application.id,
        {
          transaction,
        },
      );

    const submittedReferences = updatedReferences.filter((reference) =>
      eligibleReferences.some(
        (eligibleReference) => eligibleReference.id === reference.id,
      ),
    );

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.REFERENCE_SUBMITTED,
      entityType: AUDIT_ENTITY_TYPES.REFERENCE,
      entityId: application.id,
      applicationId: application.id,
      previousData,
      newData: submittedReferences.map((reference) => reference.toJSON()),
      metadata: {
        submittedCount: eligibleReferences.length,
      },
      options: {
        transaction,
      },
    });

    return {
      submittedCount: eligibleReferences.length,
      references: updatedReferences,
    };
  });
};

export const referenceService = {
  getApplicantReferences,
  getApplicantReferenceById,
  createReference,
  updateReference,
  deleteReference,
  submitReferences,
};

export default referenceService;
