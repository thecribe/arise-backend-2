/**
 * -----------------------------------------------------------------------------
 * File: controller.js
 *
 * Description:
 * HTTP controllers for applicant training certificates.
 * -----------------------------------------------------------------------------
 */

import { createAuditContext } from "../../../common/audit/audit-context.js";
import { ApiResponse } from "../../../common/responses/api-response.js";
import applicantTrainingCertificateService from "./applicant-training-certificate.service.js";

/**
 * Retrieve all training certificates for an application.
 */
const getTrainingCertificates = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    const certificates =
      await applicantTrainingCertificateService.getTrainingCertificates(
        applicationId,
      );

    return ApiResponse.success(
      res,
      certificates,
      "Training certificates retrieved successfully.",
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve a single training certificate.
 */
const getTrainingCertificateById = async (req, res, next) => {
  try {
    const { applicationId, certificateId } = req.params;

    const certificate =
      await applicantTrainingCertificateService.getTrainingCertificateById(
        applicationId,
        certificateId,
      );

    return ApiResponse.success(
      res,
      certificate,
      "Training certificate retrieved successfully.",
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Create a training certificate.
 */
const createTrainingCertificate = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    const auditContext = createAuditContext(req);

    const uploadedBy = req.user?.id ?? null;

    const certificate =
      await applicantTrainingCertificateService.createTrainingCertificate(
        applicationId,
        req.body,
        uploadedBy,
        auditContext,
      );

    return ApiResponse.success(
      res,
      certificate,
      "Training certificate uploaded successfully.",
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update a training certificate.
 */
const updateTrainingCertificate = async (req, res, next) => {
  try {
    const { applicationId, certificateId } = req.params;

    const auditContext = createAuditContext(req);

    const certificate =
      await applicantTrainingCertificateService.updateTrainingCertificate(
        applicationId,
        certificateId,
        req.body,
        auditContext,
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
 * Delete a training certificate.
 */
const deleteTrainingCertificate = async (req, res, next) => {
  try {
    const { applicationId, certificateId } = req.params;

    const auditContext = createAuditContext(req);

    await applicantTrainingCertificateService.deleteTrainingCertificate(
      applicationId,
      certificateId,
      auditContext,
    );

    return ApiResponse.success(
      res,
      null,
      "Training certificate deleted successfully.",
    );
  } catch (error) {
    next(error);
  }
};

//TRAINING COMMENT

/**
 * -----------------------------------------------------------------------------
 * File: controller.js
 *
 * Description:
 * HTTP controllers for Training Certificate section comments.
 * -----------------------------------------------------------------------------
 */

/**
 * Retrieve comments for an application section.
 */
const getComments = async (req, res, next) => {
  try {
    const { applicationId, sectionId } = req.params;

    const comments = await applicantTrainingCertificateService.getComments(
      applicationId,
      sectionId,
    );

    return ApiResponse.success(
      res,
      comments,
      "Section comments retrieved successfully.",
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Create a section review comment.
 */
const createComment = async (req, res, next) => {
  try {
    const { applicationId, sectionId } = req.params;

    const auditContext = createAuditContext(req);

    const createdBy = req.user?.id;

    const comment = await applicantTrainingCertificateService.createComment(
      applicationId,
      sectionId,
      req.body,
      createdBy,
      auditContext,
    );

    return ApiResponse.success(
      res,
      comment,
      "Section comment created successfully.",
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update a section review comment.
 */
const updateComment = async (req, res, next) => {
  try {
    const { applicationId, sectionId, commentId } = req.params;

    const auditContext = createAuditContext(req);

    const comment = await applicantTrainingCertificateService.updateComment(
      applicationId,
      sectionId,
      commentId,
      req.body,
      auditContext,
    );

    return ApiResponse.success(
      res,
      comment,
      "Section comment updated successfully.",
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a section review comment.
 */
const deleteComment = async (req, res, next) => {
  try {
    const { applicationId, sectionId, commentId } = req.params;

    const auditContext = createAuditContext(req);

    await applicantTrainingCertificateService.deleteComment(
      applicationId,
      sectionId,
      commentId,
      auditContext,
    );

    return ApiResponse.success(
      res,
      null,
      "Section comment deleted successfully.",
    );
  } catch (error) {
    next(error);
  }
};

/**
 * -----------------------------------------------------------------------------
 * File: controller.js
 *
 * Description:
 * HTTP controllers for Training Certificate section status.
 * -----------------------------------------------------------------------------
 */

/**
 * Retrieve the section status.
 */
const getSectionStatus = async (req, res, next) => {
  try {
    const { applicationId, sectionId } = req.params;

    const section = await applicantTrainingCertificateService.getSectionStatus(
      applicationId,
      sectionId,
    );

    return ApiResponse.success(
      res,
      section,
      "Training Certificate section status retrieved successfully.",
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update the section status.
 */
const updateSectionStatus = async (req, res, next) => {
  try {
    const { applicationId, sectionId } = req.params;

    const { status } = req.body;

    const auditContext = createAuditContext(req);

    const section =
      await applicantTrainingCertificateService.updateSectionStatus(
        applicationId,
        sectionId,
        status,
        auditContext,
      );

    return ApiResponse.success(
      res,
      section,
      "Training Certificate section status updated successfully.",
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

  //OMMENTS
  getComments,
  createComment,
  updateComment,
  deleteComment,

  //Status
  getSectionStatus,
  updateSectionStatus,
};
