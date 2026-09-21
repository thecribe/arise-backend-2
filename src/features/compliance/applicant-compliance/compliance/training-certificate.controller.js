import { createAuditContext } from "../../../../common/audit/audit-context.js";
import { ApiResponse } from "../../../../common/responses/api-response.js";
import trainingCertificateService from "./training-certificate.service.js";

const getApplicantId = (req) => req.user.id;

const getAuditContext = (req) => createAuditContext(req);

/**
 * GET /training-certificates/:sectionId
 */
const getTrainingCertificates = async (req, res, next) => {
  try {
    const result =
      await trainingCertificateService.getApplicantTrainingCertificates(
        getApplicantId(req),
        req.params.sectionId,
      );

    return ApiResponse.success(
      res,
      result,
      "Training certificates retrieved successfully.",
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /training-certificates/:sectionId/:certificateId
 */
const getTrainingCertificateById = async (req, res, next) => {
  try {
    const result =
      await trainingCertificateService.getApplicantTrainingCertificateById(
        getApplicantId(req),
        req.params.sectionId,
        req.params.certificateId,
      );

    return ApiResponse.success(
      res,
      result,
      "Training certificate retrieved successfully.",
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /training-certificates/:sectionId
 */
const createTrainingCertificate = async (req, res, next) => {
  try {
    const certificate =
      await trainingCertificateService.createTrainingCertificate(
        getApplicantId(req),
        req.params.sectionId,
        req.body,
        getAuditContext(req),
      );

    return ApiResponse.success(
      res,
      certificate,
      "Training certificate created successfully.",
      201,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /training-certificates/:sectionId/:certificateId
 */
const updateTrainingCertificate = async (req, res, next) => {
  try {
    const certificate =
      await trainingCertificateService.updateTrainingCertificate(
        getApplicantId(req),
        req.params.sectionId,
        req.params.certificateId,
        req.body,
        getAuditContext(req),
      );

    return ApiResponse.success(
      res,
      certificate,
      "Training certificate updated successfully.",
    );
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /training-certificates/:sectionId/:certificateId
 */
const deleteTrainingCertificate = async (req, res, next) => {
  try {
    const result = await trainingCertificateService.deleteTrainingCertificate(
      getApplicantId(req),
      req.params.sectionId,
      req.params.certificateId,
      getAuditContext(req),
    );

    return ApiResponse.success(
      res,
      result,
      "Training certificate deleted successfully.",
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /training-certificates/:sectionId/submit
 */
const submitTrainingCertificates = async (req, res, next) => {
  try {
    const result = await trainingCertificateService.submitTrainingCertificates(
      getApplicantId(req),
      req.params.sectionId,
      getAuditContext(req),
    );

    return ApiResponse.success(
      res,
      result,
      "Training certificates submitted successfully.",
    );
  } catch (error) {
    next(error);
  }
};

export default {
  getTrainingCertificates,
  getTrainingCertificateById,
  createTrainingCertificate,
  updateTrainingCertificate,
  deleteTrainingCertificate,
  submitTrainingCertificates,
};
