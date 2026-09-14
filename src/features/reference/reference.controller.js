import { createAuditContext } from "../../common/audit/audit-context.js";
import { logger } from "../../common/logger/logger.js";
import { ApiResponse } from "../../common/responses/api-response.js";
import { referenceService } from "./reference.service.js";

const getReferences = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    const references = await referenceService.getReferences(applicationId);

    return ApiResponse.success(
      res,
      references,
      "References retrieved successfully.",
    );
  } catch (error) {
    next(error);
  }
};

const createReference = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    const auditContext = createAuditContext(req);

    const reference = await referenceService.createReference(
      applicationId,
      req.body,
      auditContext,
    );

    return ApiResponse.success(
      res,
      reference,
      "Reference created successfully.",
      201,
    );
  } catch (error) {
    next(error);
  }
};

const updateReference = async (req, res, next) => {
  try {
    const { applicationId, referenceId } = req.params;

    const auditContext = createAuditContext(req);

    const reference = await referenceService.updateApplicantReference(
      applicationId,
      referenceId,
      req.body,
      auditContext,
    );

    return ApiResponse.success(
      res,
      reference,
      "Reference updated successfully.",
    );
  } catch (error) {
    next(error);
  }
};
const updateManagerReference = async (req, res, next) => {
  try {
    const { applicationId, referenceId } = req.params;

    const auditContext = createAuditContext(req);

    const reference = await referenceService.updateManagerReference(
      applicationId,
      referenceId,
      req.body,
      auditContext,
    );

    return ApiResponse.success(
      res,
      reference,
      "Reference updated successfully.",
    );
  } catch (error) {
    next(error);
  }
};

const submitReferences = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    const auditContext = createAuditContext(req);

    const result = await referenceService.submitReferences(
      applicationId,
      auditContext,
    );

    return ApiResponse.success(
      res,
      result,
      "References submitted successfully.",
    );
  } catch (error) {
    next(error);
  }
};

const saveReferenceResponse = async (req, res, next) => {
  try {
    const { referenceId } = req.params;

    const auditContext = createAuditContext(req);

    const response = await referenceService.saveReferenceResponse(
      referenceId,
      req.body,
      auditContext,
    );

    return ApiResponse.success(
      res,
      response,
      "Reference response submitted successfully.",
    );
  } catch (error) {
    next(error);
  }
};

const updateReferenceStatus = async (req, res, next) => {
  try {
    const { applicationId, referenceId } = req.params;

    const { status } = req.body;

    const auditContext = createAuditContext(req);

    const reference = await referenceService.updateReferenceStatus(
      applicationId,
      referenceId,
      status,
      auditContext,
    );

    return ApiResponse.success(
      res,
      reference,
      "Reference status updated successfully.",
    );
  } catch (error) {
    next(error);
  }
};

const getReferenceResponse = async (req, res, next) => {
  try {
    const { applicationId, referenceId } = req.params;

    const response = await referenceService.getReferenceResponse(
      applicationId,
      referenceId,
    );
    // console.log({ response });
    return ApiResponse.success(
      res,
      response,
      "Reference response retrieved successfully.",
    );
  } catch (error) {
    next(error);
  }
};

const saveManagerReferenceResponse = async (req, res, next) => {
  try {
    const { applicationId, referenceId } = req.params;

    const auditContext = createAuditContext(req);

    const response = await referenceService.saveManagerReferenceResponse(
      applicationId,
      referenceId,
      req.body,
      auditContext,
    );

    return ApiResponse.success(
      res,
      response,
      "Reference response saved successfully.",
    );
  } catch (error) {
    next(error);
  }
};

const updateReferenceMailStatus = async (req, res, next) => {
  try {
    const { applicationId, referenceId } = req.params;

    const { status } = req.body;

    const auditContext = createAuditContext(req);

    const mailStatus = await referenceService.updateReferenceMailStatus(
      applicationId,
      referenceId,
      status,
      auditContext,
    );

    return ApiResponse.success(
      res,
      mailStatus,
      "Reference mail status updated successfully.",
    );
  } catch (error) {
    next(error);
  }
};

const refuseReference = async (req, res, next) => {
  try {
    const { referenceId } = req.params;

    const auditContext = createAuditContext(req);

    const result = await referenceService.refuseReference(
      referenceId,
      auditContext,
    );

    return ApiResponse.success(
      res,
      result,
      "Reference refusal recorded successfully.",
    );
  } catch (error) {
    next(error);
  }
};

export const referenceController = {
  getReferences,
  createReference,
  updateReference,
  updateManagerReference,
  submitReferences,
  saveReferenceResponse,
  updateReferenceStatus,
  getReferenceResponse,
  saveManagerReferenceResponse,
  updateReferenceMailStatus,
  refuseReference,
};
