import { AUDIT_ACTIONS } from "../../common/constants/audit-actions.js";
import { AUDIT_ENTITY_TYPES } from "../../common/constants/audit-entity-types.js";
import { JOB_TYPES } from "../../common/constants/job-types.js";
import { TOKEN_TYPES } from "../../common/constants/token-types.js";
import { BadRequestError } from "../../common/errors/bad-request-error.js";
import { NotFoundError } from "../../common/errors/not-found-error.js";
import { UnauthorizedError } from "../../common/errors/unauthorized-error.js";
import { logger } from "../../common/logger/logger.js";
import { tokenService } from "../../common/services/token.service.js";
import { sequelize } from "../../config/database.js";
import { jobService } from "../../infrastructure/jobs/job.service.js";
import { recordAuditAction } from "../audit/record-audit-action.js";
import { authRepository } from "../auth/auth.repository.js";
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
        applicationId: applicationId,
        companyName: data.companyName ?? null,
        fromDate: data.fromDate ?? null,
        toDate: data.toDate ?? null,
        refereeName: data.refereeName ?? null,
        refereeEmail: data.refereeEmail ?? null,
        refereePhone: data.refereePhone ?? null,
        refereeRelationship: data.refereeRelationship ?? null,
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

const updateApplicantReference = async (
  applicationId,
  referenceId,
  data,
  auditContext,
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
      companyName: reference.companyName,
      fromDate: reference.fromDate,
      toDate: reference.toDate,
      refereeName: reference.refereeName,
      refereeEmail: reference.refereeEmail,
      refereePhone: reference.refereePhone,
      refereeRelationship: reference.refereeRelationship,
      status: reference.status,
    };

    await referenceRepository.updateReference(
      reference,
      {
        companyName: data.companyName ?? reference.companyName,
        fromDate: data.fromDate ?? reference.fromDate,
        toDate: data.toDate ?? reference.toDate,
        refereeName: data.refereeName ?? reference.refereeName,
        refereeEmail: data.refereeEmail ?? reference.refereeEmail,
        refereePhone: data.refereePhone ?? reference.refereePhone,
        refereeRelationship:
          data.refereeRelationship ?? reference.refereeRelationship,
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
        // actor: "applicant",
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

  const formattedReferences = references.map((reference) => ({
    id: reference.id,
    applicationId: reference.application_id,
    companyName: reference.companyName,
    fromDate: reference.fromDate,
    toDate: reference.toDate,
    refereeName: reference.refereeName,
    refereeEmail: reference.refereeEmail,
    refereePhone: reference.refereePhone,
    refereeRelationship: reference.refereeRelationship,
    status: reference.status,

    hasResponse: reference.response ? true : false,

    mailStatus: reference.mailStatus ? reference.mailStatus.status : "Not sent",
  }));

  return formattedReferences;
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

    const editableReferences = references.filter((reference) =>
      ["in_progress", "rejected"].includes(reference.status),
    );

    if (!editableReferences.length) {
      throw new BadRequestError(
        "There are no references available for submission.",
      );
    }

    for (const reference of editableReferences) {
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
          actor: "applicant",
          operation: "submit",
        },
        options: { transaction },
      });
    }

    return {
      applicationId,
      submittedCount: editableReferences.length,
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
          referenceId: referenceId,
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
const updateManagerReference = async (
  applicationId,
  referenceId,
  data,
  auditContext,
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

    const reference =
      await referenceRepository.findReferenceByApplicationIdAndId(
        applicationId,
        referenceId,
        { transaction },
      );

    if (!reference) {
      throw new NotFoundError("Reference not found.");
    }

    const previousData = {
      companyName: reference.companyName,
      fromDate: reference.fromDate,
      toDate: reference.toDate,
      refereeName: reference.refereeName,
      refereeEmail: reference.refereeEmail,
      refereePhone: reference.refereePhone,
      refereeRelationship: reference.refereeRelationship,
      status: reference.status,
    };
    await referenceRepository.updateReference(
      reference,
      {
        companyName: data.companyName ?? reference.companyName,
        fromDate: data.fromDate ?? reference.fromDate,
        toDate: data.toDate ?? reference.toDate,
        refereeName: data.refereeName ?? reference.refereeName,
        refereeEmail: data.refereeEmail ?? reference.refereeEmail,
        refereePhone: data.refereePhone ?? reference.refereePhone,
        refereeRelationship:
          data.refereeRelationship ?? reference.refereeRelationship,
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
        actor: "manager",
        operation: "update",
      },
      options: { transaction },
    });

    return reference;
  });
};
const updateReferenceStatus = async (
  applicationId,
  referenceId,
  status,
  auditContext,
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

    const reference =
      await referenceRepository.findReferenceByApplicationIdAndId(
        applicationId,
        referenceId,
        { transaction },
      );

    if (!reference) {
      throw new NotFoundError("Reference not found.");
    }

    const allowedStatuses = [
      "in_progress",
      "submitted",
      "approved",
      "rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      throw new BadRequestError("Invalid reference status.");
    }

    const previousStatus = reference.status;

    if (previousStatus === status) {
      throw new BadRequestError(`Reference is already ${status}.`);
    }

    await referenceRepository.updateReference(
      reference,
      {
        status,
      },
      { transaction },
    );

    const auditAction =
      status === "approved"
        ? AUDIT_ACTIONS.REFERENCE_APPROVED
        : status === "rejected"
          ? AUDIT_ACTIONS.REFERENCE_REJECTED
          : status === "submitted"
            ? AUDIT_ACTIONS.REFERENCE_SUBMITTED
            : AUDIT_ACTIONS.REFERENCE_UPDATED;

    await recordAuditAction({
      auditContext,
      action: auditAction,
      entityType: AUDIT_ENTITY_TYPES.REFERENCE,
      entityId: reference.id,
      applicationId,
      previousData: {
        status: previousStatus,
      },
      newData: {
        status,
      },
      metadata: {
        feature: "reference",
        operation: "status_update",
        actor: "manager",
      },
      options: { transaction },
    });

    return reference;
  });
};

const getReferenceResponse = async (applicationId, referenceId) => {
  const application =
    await recruitmentRepository.findApplicantApplicationByApplicationId(
      applicationId,
    );

  if (!application) {
    throw new NotFoundError("Applicant application not found.");
  }
  const reference = await referenceRepository.findReferenceByApplicationIdAndId(
    applicationId,
    referenceId,
  );

  if (!reference) {
    throw new NotFoundError("Reference not found.");
  }

  if (!reference.response) {
    return null;
  }

  return {
    id: reference.response.id,
    referenceId: reference.response.reference_id,

    reEmploy: reference.response.reEmploy,

    ratings: parseJsonValue(reference.response.ratings),

    detailReference: reference.response.detailReference,

    refererName: reference.response.refererName,

    refererSignature: parseJsonValue(reference.response.refererSignature),
    signatureDate: reference.response.signatureDate,
  };
};

const saveManagerReferenceResponse = async (
  applicationId,
  referenceId,
  data,
  auditContext,
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

    const reference =
      await referenceRepository.findReferenceByApplicationIdAndId(
        applicationId,
        referenceId,
        { transaction },
      );

    if (!reference) {
      throw new NotFoundError("Reference not found.");
    }

    const existingResponse = await referenceRepository.findReferenceResponse(
      referenceId,
      { transaction },
    );

    const payload = {
      referenceId: referenceId,
      reEmploy: data.reEmploy,
      ratings: serializeJsonValue(data.ratings),
      detailReference: data.detailReference ?? null,
      refererName: data.refererName ?? null,
      refererSignature: serializeJsonValue(data.refererSignature),
      signatureDate: data.signatureDate ?? null,
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

    await recordAuditAction({
      auditContext,
      action: existingResponse
        ? AUDIT_ACTIONS.REFERENCE_RESPONSE_UPDATED
        : AUDIT_ACTIONS.REFERENCE_RESPONSE_CREATED,
      entityType: AUDIT_ENTITY_TYPES.REFERENCE_RESPONSE,
      entityId: response.id,
      applicationId,
      previousData: existingResponse
        ? {
            reEmploy: existingResponse.reEmploy,
            ratings: parseJsonValue(existingResponse.ratings),
            detailReference: existingResponse.detailReference,
            refererName: existingResponse.refererName,
            refererSignature: parseJsonValue(existingResponse.refererSignature),
          }
        : null,
      newData: data,
      metadata: {
        feature: "reference",
        actor: "manager",
        operation: existingResponse ? "update" : "create",
      },
      options: { transaction },
    });

    return {
      id: response.id,
      referenceId: response.reference_id,
      reEmploy: response.reEmploy,
      ratings: parseJsonValue(response.ratings),
      detailReference: response.detailReference,
      refererName: response.refererName,
      refererSignature: parseJsonValue(response.refererSignature),
      signatureDate: response.signatureDate,
    };
  });
};

const updateReferenceMailStatus = async (
  applicationId,
  referenceId,
  status,
  auditContext,
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

    const reference =
      await referenceRepository.findReferenceByApplicationIdAndId(
        applicationId,
        referenceId,
        { transaction },
      );

    if (!reference) {
      throw new NotFoundError("Reference not found.");
    }

    const allowedStatuses = ["Not sent", "Pending", "Received", "Refused"];

    if (!allowedStatuses.includes(status)) {
      throw new BadRequestError("Invalid reference mail status.");
    }

    let mailStatus = await referenceRepository.findReferenceMailStatus(
      referenceId,
      { transaction },
    );

    const previousStatus = mailStatus?.status ?? "Not sent";

    if (!mailStatus) {
      mailStatus = await referenceRepository.createReferenceMailStatus(
        {
          reference_id: referenceId,
          status,
        },
        { transaction },
      );
    } else {
      await referenceRepository.updateReferenceMailStatus(
        mailStatus,
        { status },
        { transaction },
      );
    }

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.REFERENCE_MAIL_STATUS_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.REFERENCE_MAIL_STATUS,
      entityId: mailStatus.id,
      applicationId,
      previousData: {
        status: previousStatus,
      },
      newData: {
        status,
      },
      metadata: {
        feature: "reference",
        referenceId,
      },
      options: { transaction },
    });

    return {
      id: mailStatus.id,
      referenceId: mailStatus.reference_id,
      status: mailStatus.status,
    };
  });
};

const refuseReference = async (referenceId, auditContext) => {
  return sequelize.transaction(async (transaction) => {
    const reference = await referenceRepository.findReferenceById(referenceId, {
      transaction,
    });

    if (!reference) {
      throw new NotFoundError("Reference not found.");
    }

    let mailStatus = await referenceRepository.findReferenceMailStatus(
      referenceId,
      { transaction },
    );

    const previousStatus = mailStatus?.status ?? "Not sent";

    if (previousStatus !== "Pending") {
      throw new BadRequestError(
        "This reference cannot be refused in its current mail status.",
      );
    }

    if (!mailStatus) {
      mailStatus = await referenceRepository.createReferenceMailStatus(
        {
          reference_id: referenceId,
          status: "Refused",
        },
        { transaction },
      );
    } else {
      await referenceRepository.updateReferenceMailStatus(
        mailStatus,
        {
          status: "Refused",
        },
        { transaction },
      );
    }

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.REFERENCE_MAIL_STATUS_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.REFERENCE_MAIL_STATUS,
      entityId: mailStatus.id,
      applicationId: reference.application_id,
      previousData: {
        status: previousStatus,
      },
      newData: {
        status: "Refused",
      },
      metadata: {
        feature: "reference",
        operation: "refused",
        actor: "referee",
      },
      options: { transaction },
    });

    return {
      id: mailStatus.id,
      referenceId: mailStatus.reference_id,
      status: mailStatus.status,
    };
  });
};

const sendReferenceMail = async (referenceId, applicationId, auditContext) => {
  return sequelize.transaction(async (transaction) => {
    const reference =
      await referenceRepository.findReferenceByApplicationIdAndId(
        applicationId,
        referenceId,
        {
          transaction,
        },
      );
    if (!reference) {
      throw new NotFoundError("Reference not found.");
    }
    const userId = reference.application.applicant_id;
    const user = await authRepository.findUserById(userId);
    const mailReferenceToken = tokenService.generate();
    const tokenHash = tokenService.hash(mailReferenceToken);

    await authRepository.createToken(
      {
        user_id: userId,
        type: TOKEN_TYPES.REFERENCE_RESPONSE,
        token_hash: tokenHash,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      transaction,
    );
    // A response has now been received.
    let mailStatus = await referenceRepository.findReferenceMailStatus(
      referenceId,
      { transaction },
    );

    if (!mailStatus) {
      mailStatus = await referenceRepository.createReferenceMailStatus(
        {
          referenceId: referenceId,
          status: "Pending",
        },
        { transaction },
      );
    } else {
      await referenceRepository.updateReferenceMailStatus(
        mailStatus,
        {
          status: "Pending",
        },
        { transaction },
      );
    }

    await jobService.dispatch(
      {
        type: JOB_TYPES.REFERENCE_RESPONSE,

        payload: {
          userId: userId,
          applicantName: user.first_name + " " + user.last_name,
          refereeName: reference.refereeName,
          refereeEmail: reference.refereeEmail,
          referenceId,
          token: mailReferenceToken,
        },
      },
      transaction,
    );
    return { userId };
  });
};

/**
 * -----------------------------------------------------------------------------
 * Get public reference details
 *
 * Description:
 * Validates the reference token and retrieves the applicant and referee
 * information required to generate the public reference form.
 *
 * Important:
 * - Does not retrieve an existing reference response.
 * - Does not retire the token.
 * - The token identifies the applicant.
 * - The reference ID identifies the reference being completed.
 * -----------------------------------------------------------------------------
 */
const getPublicReference = async (referenceId, token) => {
  /**
   * Validate token presence.
   */
  if (!token) {
    throw new UnauthorizedError("Invalid or expired reference link.");
  }

  /**
   * Hash the supplied token.
   */
  const tokenHash = tokenService.hash(token);

  /**
   * Find a valid reference token.
   *
   * findToken already checks:
   * - Token hash
   * - Token type
   * - used_at
   * - expires_at
   */
  const referenceToken = await authRepository.findToken({
    tokenHash,
    type: TOKEN_TYPES.REFERENCE_RESPONSE,
  });

  if (!referenceToken || !referenceToken.user) {
    throw new UnauthorizedError("Invalid or expired reference link.");
  }

  /**
   * Retrieve reference without its existing response or mail status.
   */
  const reference =
    await referenceRepository.findPublicReferenceById(referenceId);

  if (!reference) {
    throw new NotFoundError("Reference not found.");
  }

  /**
   * Ensure the reference belongs to the applicant associated with the token.
   */
  if (reference.application?.applicant_id !== referenceToken.user.id) {
    throw new UnauthorizedError("Invalid or expired reference link.");
  }

  /**
   * Return only the information required by the public page.
   */
  return {
    applicant: {
      id: referenceToken.user.id,
      firstName: referenceToken.user.first_name,
      lastName: referenceToken.user.last_name,
      email: referenceToken.user.email,
      phoneNumber: referenceToken.user.phone_number,
      address: referenceToken.user.address,
      postcode: referenceToken.user.postcode,
    },

    reference: {
      id: reference.id,
      companyName: reference.companyName,
      fromDate: reference.fromDate,
      toDate: reference.toDate,
      refereeName: reference.refereeName,
      refereeEmail: reference.refereeEmail,
      refereePhone: reference.refereePhone,
      refereeRelationship: reference.refereeRelationship,
    },
  };
};

/**
 * -----------------------------------------------------------------------------
 * Submit public reference response
 *
 * Description:
 * Creates or replaces a referee's response and retires the reference token.
 *
 * Transaction includes:
 * - Token validation and locking
 * - Reference ownership validation
 * - Response creation/update
 * - Reference status update
 * - Reference mail status update
 * - Token retirement
 * - Audit logging
 * -----------------------------------------------------------------------------
 */
const submitPublicReference = async (
  referenceId,
  { token, ...responseData },
  auditContext,
) => {
  if (!token) {
    throw new UnauthorizedError("Invalid or expired reference link.");
  }

  const tokenHash = tokenService.hash(token);

  /**
   * All submission operations happen within one transaction.
   * Sequelize automatically rolls back if the callback throws.
   */
  return sequelize.transaction(async (transaction) => {
    /**
     * -------------------------------------------------------------------------
     * 1. Validate and lock token
     * -------------------------------------------------------------------------
     *
     * The row lock prevents concurrent submissions using the same token.
     */
    const referenceToken = await authRepository.findToken(
      {
        tokenHash,
        type: TOKEN_TYPES.REFERENCE_RESPONSE,
      },
      {
        transaction,
        lock: transaction.LOCK.UPDATE,
      },
    );

    if (!referenceToken || !referenceToken.user) {
      throw new UnauthorizedError("Invalid or expired reference link.");
    }

    /**
     * -------------------------------------------------------------------------
     * 2. Retrieve and lock reference
     * -------------------------------------------------------------------------
     */
    const reference = await referenceRepository.findPublicReferenceById(
      referenceId,
      {
        transaction,
        lock: transaction.LOCK.UPDATE,
      },
    );

    if (!reference) {
      throw new NotFoundError("Reference not found.");
    }

    /**
     * -------------------------------------------------------------------------
     * 3. Validate reference ownership
     * -------------------------------------------------------------------------
     */
    if (reference.application?.applicant_id !== referenceToken.user.id) {
      throw new UnauthorizedError("Invalid or expired reference link.");
    }

    /**
     * -------------------------------------------------------------------------
     * 4. Find existing response
     * -------------------------------------------------------------------------
     */
    const existingResponse = await referenceRepository.findReferenceResponse(
      referenceId,
      {
        transaction,
        lock: transaction.LOCK.UPDATE,
      },
    );

    /**
     * -------------------------------------------------------------------------
     * 5. Create or replace response
     * -------------------------------------------------------------------------
     */
    let response;
    let responseOperation;

    const responsePayload = {
      ...responseData,
      referenceId,
      ratings: serializeJsonValue(responseData.ratings),
      refererSignature: serializeJsonValue(responseData.refererSignature),
    };

    if (existingResponse) {
      response = await referenceRepository.updateReferenceResponse(
        existingResponse,
        responsePayload,
        {
          transaction,
        },
      );

      responseOperation = "updated";
    } else {
      response = await referenceRepository.createReferenceResponse(
        responsePayload,
        {
          transaction,
        },
      );

      responseOperation = "created";
    }

    /**
     * -------------------------------------------------------------------------
     * 6. Update reference status
     * -------------------------------------------------------------------------
    //  */
    // const previousReferenceStatus = reference.status;

    // await referenceRepository.updateReference(
    //   reference,
    //   {
    //     status: "submitted",
    //   },
    //   {
    //     transaction,
    //   },
    // );

    /**
     * -------------------------------------------------------------------------
     * 7. Update reference mail status
     * -------------------------------------------------------------------------
     */
    const mailStatus = await referenceRepository.findReferenceMailStatus(
      referenceId,
      {
        transaction,
        lock: transaction.LOCK.UPDATE,
      },
    );

    if (!mailStatus) {
      throw new NotFoundError("Reference mail status not found.");
    }

    const previousMailStatus = mailStatus.status;

    await referenceRepository.updateReferenceMailStatus(
      mailStatus,
      {
        status: "Received",
      },
      {
        transaction,
      },
    );

    /**
     * -------------------------------------------------------------------------
     * 8. Retire token
     * -------------------------------------------------------------------------
     *
     * markTokenAsUsed updates:
     * - used_at
     * - expires_at
     */
    await authRepository.markTokenAsUsed(referenceToken, transaction);

    /**
     * -------------------------------------------------------------------------
     * 9. Record audit action
     *
     * Never record:
     * - Raw token
     * - Token hash
     * - Referee signature
     * - Sensitive reference response contents
     * -------------------------------------------------------------------------
     */
    await recordAuditAction({
      auditContext: {
        ...auditContext,
        userId: referenceToken.user.id,
      },

      action: AUDIT_ACTIONS.REFERENCE_RESPONSE_CREATED,

      entityType: AUDIT_ENTITY_TYPES.REFERENCE_RESPONSE,

      entityId: response.id,

      applicationId: reference.applicationId,

      previousData: {
        // referenceStatus: previousReferenceStatus,
        mailStatus: previousMailStatus,
        responseExists: Boolean(existingResponse),
      },

      newData: {
        referenceStatus: "submitted",
        mailStatus: "received",
        responseId: response.id,
        responseOperation,
      },

      metadata: {
        referenceId,
        submissionSource: "public_reference_form",
      },

      options: {
        transaction,
      },
    });

    /**
     * -------------------------------------------------------------------------
     * 10. Return submission result
     * -------------------------------------------------------------------------
     */
    return {
      referenceId,
      responseId: response.id,
      status: "submitted",
      message: "Reference submitted successfully.",
    };
  });
};

export const referenceService = {
  createReference,
  updateApplicantReference,
  updateManagerReference,

  getReferences,
  submitReferences,
  saveReferenceResponse,
  updateReferenceStatus,

  getReferenceResponse,

  saveManagerReferenceResponse,
  updateReferenceMailStatus,
  refuseReference,

  sendReferenceMail,
  getPublicReference,
  submitPublicReference,
};
