import { createAuditContext } from "../../../../common/audit/audit-context.js";
import { ApiResponse } from "../../../../common/responses/api-response.js";
import referenceService from "./applicant-complaince-reference.service.js";

const getApplicantId = (req) => req.user.id;

const getAuditContext = (req) => createAuditContext(req);

/**
 * GET /references
 */
const getReferences = async (req, res, next) => {
  try {
    const references = await referenceService.getApplicantReferences(
      getApplicantId(req),
    );

    return ApiResponse.success(
      res,
      references,
      "References retrieved successfully.",
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /references/:referenceId
 */
const getReferenceById = async (req, res, next) => {
  try {
    const reference = await referenceService.getApplicantReferenceById(
      getApplicantId(req),
      req.params.referenceId,
    );

    return ApiResponse.success(
      res,
      reference,
      "Reference retrieved successfully.",
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /references
 */
const createReference = async (req, res, next) => {
  try {
    const reference = await referenceService.createReference(
      getApplicantId(req),
      req.body,
      getAuditContext(req),
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

/**
 * PATCH /references/:referenceId
 */
const updateReference = async (req, res, next) => {
  try {
    const reference = await referenceService.updateReference(
      getApplicantId(req),
      req.params.referenceId,
      req.body,
      getAuditContext(req),
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

/**
 * DELETE /references/:referenceId
 */
const deleteReference = async (req, res, next) => {
  try {
    const result = await referenceService.deleteReference(
      getApplicantId(req),
      req.params.referenceId,
      getAuditContext(req),
    );

    return ApiResponse.success(res, result, "Reference deleted successfully.");
  } catch (error) {
    next(error);
  }
};

/**
 * POST /references/submit
 */
const submitReferences = async (req, res, next) => {
  try {
    const result = await referenceService.submitReferences(
      getApplicantId(req),
      getAuditContext(req),
    );

    return ApiResponse.success(
      res,
      result,
      "Eligible references submitted successfully.",
    );
  } catch (error) {
    next(error);
  }
};

export const applicantReferenceController = {
  getReferences,
  getReferenceById,
  createReference,
  updateReference,
  deleteReference,
  submitReferences,
};
