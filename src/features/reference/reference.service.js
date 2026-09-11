import { AUDIT_ACTIONS } from "../../common/constants/audit-actions.js";
import { AUDIT_ENTITY_TYPES } from "../../common/constants/audit-entity-types.js";
import { BadRequestError } from "../../common/errors/bad-request-error.js";
import { NotFoundError } from "../../common/errors/not-found-error.js";
import { sequelize } from "../../config/database.js";
import { recordAuditAction } from "../audit/record-audit-action.js";
import { recruitmentRepository } from "../recruitment/recruitment.repository.js";
import { referenceRepository } from "./reference.repository.js";

const parseJsonValue = (value) => {
  if (!value) return null;

  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const serializeJsonValue = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  return JSON.stringify(value);
};

/**
 * Create a new reference for an application.
 *
 * New references always start as `in_progress`.
 */
const createReference = async (applicationId, data, auditContext) => {
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

    const reference = await referenceRepository.createReference(
      {
        application_id: applicationId,
        company_name: data.companyName ?? null,
        from_date: data.fromDate ?? null,
        to_date: data.toDate ?? null,
        referee_name: data.refereeName ?? null,
        referee_email: data.refereeEmail ?? null,
        referee_phone: data.refereePhone ?? null,
        referee_relationship: data.refereeRelationship ?? null,
        status: "in_progress",
      },
      { transaction },
    );

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.REFERENCE_CREATED,
      entityType: AUDIT_ENTITY_TYPES.REFERENCE,
      entityId: reference.id,
      applicationId,
      previousData: null,
      newData: data,
      metadata: {
        feature: "reference",
        operation: "create",
      },
      options: { transaction },
    });

    return reference;
  });
};

const updateReference = async (
  applicationId,
  referenceId,
  data,
  auditContext,
) => {
  return sequelize.transaction(async (transaction) => {
    const reference =
      await referenceRepository.findReferenceByApplicationIdAndId(
        applicationId,
        referenceId,
        { transaction },
      );

    if (!reference) {
      throw new NotFoundError("Reference not found.");
    }

    if (!["in_progress", "rejected"].includes(reference.status)) {
      throw new BadRequestError(
        "This reference cannot be edited in its current status.",
      );
    }

    const previousData = {
      companyName: reference.company_name,
      fromDate: reference.from_date,
      toDate: reference.to_date,
      refereeName: reference.referee_name,
      refereeEmail: reference.referee_email,
      refereePhone: reference.referee_phone,
      refereeRelationship: reference.referee_relationship,
      status: reference.status,
    };

    await referenceRepository.updateReference(
      reference,
      {
        company_name: data.companyName ?? reference.company_name,
        from_date: data.fromDate ?? reference.from_date,
        to_date: data.toDate ?? reference.to_date,
        referee_name: data.refereeName ?? reference.referee_name,
        referee_email: data.refereeEmail ?? reference.referee_email,
        referee_phone: data.refereePhone ?? reference.referee_phone,
        referee_relationship:
          data.refereeRelationship ?? reference.referee_relationship,
      },
      { transaction },
    );

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.REFERENCE_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.REFERENCE,
      entityId: reference.id,
      applicationId,
      previousData,
      newData: data,
      metadata: {
        feature: "reference",
        operation: "update",
      },
      options: { transaction },
    });

    return reference;
  });
};

const getReferences = async (applicationId) => {
  const application =
    await recruitmentRepository.findApplicantApplicationByApplicationId(
      applicationId,
    );

  if (!application) {
    throw new NotFoundError("Applicant application not found.");
  }

  const references =
    await referenceRepository.findReferencesByApplicationId(applicationId);

  return references.map((reference) => ({
    id: reference.id,
    applicationId: reference.application_id,
    companyName: reference.company_name,
    fromDate: reference.from_date,
    toDate: reference.to_date,
    refereeName: reference.referee_name,
    refereeEmail: reference.referee_email,
    refereePhone: reference.referee_phone,
    refereeRelationship: reference.referee_relationship,
    status: reference.status,

    response: reference.response
      ? {
          id: reference.response.id,
          reEmploy: reference.response.re_employ,
          ratings: parseJsonValue(reference.response.ratings),
          detailReference: reference.response.detail_reference,
          refererName: reference.response.referer_name,
          refererSignature: parseJsonValue(
            reference.response.referer_signature,
          ),
        }
      : null,

    mailStatus: reference.mailStatus
      ? {
          id: reference.mailStatus.id,
          status: reference.mailStatus.status,
        }
      : {
          id: null,
          status: "Not sent",
        },
  }));
};

const submitReferences = async (applicationId, auditContext) => {
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

    const references = await referenceRepository.findReferencesByApplicationId(
      applicationId,
      { transaction },
    );

    if (!references.length) {
      throw new BadRequestError("At least one reference is required.");
    }

    for (const reference of references) {
      if (!["in_progress", "rejected"].includes(reference.status)) {
        continue;
      }

      const previousStatus = reference.status;

      await referenceRepository.updateReference(
        reference,
        {
          status: "submitted",
        },
        { transaction },
      );

      await recordAuditAction({
        auditContext,
        action: AUDIT_ACTIONS.REFERENCE_SUBMITTED,
        entityType: AUDIT_ENTITY_TYPES.REFERENCE,
        entityId: reference.id,
        applicationId,
        previousData: {
          status: previousStatus,
        },
        newData: {
          status: "submitted",
        },
        metadata: {
          feature: "reference",
        },
        options: { transaction },
      });
    }

    return {
      applicationId,
      status: "submitted",
    };
  });
};

const saveReferenceResponse = async (referenceId, data, auditContext) => {
  return sequelize.transaction(async (transaction) => {
    const reference = await referenceRepository.findReferenceById(referenceId, {
      transaction,
    });

    if (!reference) {
      throw new NotFoundError("Reference not found.");
    }

    const existingResponse = await referenceRepository.findReferenceResponse(
      referenceId,
      { transaction },
    );

    const payload = {
      reference_id: referenceId,
      re_employ: data.reEmploy,
      ratings: serializeJsonValue(data.ratings),
      detail_reference: data.detailReference ?? null,
      referer_name: data.refererName ?? null,
      referer_signature: serializeJsonValue(data.refererSignature),
    };

    let response;

    if (!existingResponse) {
      response = await referenceRepository.createReferenceResponse(payload, {
        transaction,
      });
    } else {
      response = await referenceRepository.updateReferenceResponse(
        existingResponse,
        payload,
        { transaction },
      );
    }

    // A response has now been received.
    let mailStatus = await referenceRepository.findReferenceMailStatus(
      referenceId,
      { transaction },
    );

    if (!mailStatus) {
      mailStatus = await referenceRepository.createReferenceMailStatus(
        {
          reference_id: referenceId,
          status: "Received",
        },
        { transaction },
      );
    } else {
      await referenceRepository.updateReferenceMailStatus(
        mailStatus,
        {
          status: "Received",
        },
        { transaction },
      );
    }

    return response;
  });
};

export const referenceService = {
  createReference,
  updateReference,
  getReferences,
  submitReferences,
  saveReferenceResponse,
};
