import { createAuditContext } from "../../../common/audit/audit-context.js";
import { ApiResponse } from "../../../common/responses/api-response.js";
import { applicantDocumentService } from "./applicant-document.service.js";

/**
 * --------------------------------------------------------------------------
 * Get Applicant Documents
 * --------------------------------------------------------------------------
 */

const getApplicantDocuments = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    const documents =
      await applicantDocumentService.getApplicantDocuments(applicationId);

    return ApiResponse.success(
      res,
      documents,
      "Applicant documents retrieved successfully.",
    );
  } catch (error) {
    next(error);
  }
};

/**
 * --------------------------------------------------------------------------
 * Upload Applicant Documents
 * --------------------------------------------------------------------------
 */

const uploadApplicantDocuments = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    const auditContext = createAuditContext(req);

    const documents = await applicantDocumentService.uploadApplicantDocuments(
      applicationId,
      req.body.documents,
      auditContext,
    );

    return ApiResponse.success(
      res,
      documents,
      "Applicant documents uploaded successfully.",
    );
  } catch (error) {
    next(error);
  }
};

/**
 * --------------------------------------------------------------------------
 * Delete Applicant Document
 * --------------------------------------------------------------------------
 */

const deleteApplicantDocument = async (req, res, next) => {
  try {
    const { applicationId, documentId } = req.params;

    const auditContext = createAuditContext(req);

    const document = await applicantDocumentService.deleteApplicantDocument(
      applicationId,
      documentId,
      auditContext,
    );

    return ApiResponse.success(
      res,
      document,
      "Applicant document deleted successfully.",
    );
  } catch (error) {
    next(error);
  }
};

const applicantDocumentController = {
  getApplicantDocuments,
  uploadApplicantDocuments,
  deleteApplicantDocument,
};

export default applicantDocumentController;
