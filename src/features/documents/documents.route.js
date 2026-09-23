/**
 * -----------------------------------------------------------------------------
 * File: documents.route.js
 *
 * Description:
 * Routes for manager-generated application documents and
 * manager-uploaded applicant documents.
 * -----------------------------------------------------------------------------
 */

import { Router } from "express";

import applicantDocumentController from "./uploaded-document/applicant-document.controller.js";
import { authenticate } from "../../common/middleware/authenticate.js";
import { authorize } from "../../common/middleware/authorize.js";
import documentsController from "./documents.controller.js";
import { loadUploadUser } from "../../common/middleware/load-applicant.js";
import { applicationParseFormdata } from "../../common/middleware/applicationParseFormData.js";
import { PERMISSIONS } from "../../common/constants/permissions.js";
import createUpload from "../../common/middleware/createUpload.js";

const DocumentsRouter = Router();

/**
 * -----------------------------------------------------------------------------
 * Get Application Form Document Data
 * -----------------------------------------------------------------------------
 *
 * Returns application form values and applicant information.
 *
 * The frontend uses the response together with the application definition
 * endpoints to generate the PDF.
 * -----------------------------------------------------------------------------
 */

DocumentsRouter.get(
  "/:applicationId/application-form",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_VIEW.name),
  documentsController.getApplicationFormDocument,
);

/**
 * -----------------------------------------------------------------------------
 * Get Interview Scoresheet Document Data
 * -----------------------------------------------------------------------------
 *
 * Returns:
 * - Applicant details
 * - Interviewer information
 * - Interview date
 * - Assessment sections and scores
 * - Normalized score out of 50
 * - Interviewer signature
 * -----------------------------------------------------------------------------
 */

DocumentsRouter.get(
  "/:applicationId/interview-scoresheet",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_VIEW.name),
  documentsController.getInterviewScoresheetDocument,
);

/**
 * -----------------------------------------------------------------------------
 * Get Applicant Documents
 * -----------------------------------------------------------------------------
 *
 * Returns all documents uploaded by the recruitment manager for an applicant.
 * -----------------------------------------------------------------------------
 */

DocumentsRouter.get(
  "/:applicationId/applicant-documents",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_VIEW.name),
  applicantDocumentController.getApplicantDocuments,
);

/**
 * -----------------------------------------------------------------------------
 * Upload Applicant Documents
 * -----------------------------------------------------------------------------
 *
 * Accepts one or multiple files using the "documents" multipart field.
 *
 * Upload flow:
 *
 * authenticate
 *    ↓
 * authorize
 *    ↓
 * loadUploadUser
 *    ↓
 * createUpload("applicant-documents").any()
 *    ↓
 * applicationParseFormdata
 *    ↓
 * controller
 * -----------------------------------------------------------------------------
 */

DocumentsRouter.post(
  "/:applicationId/applicant-documents",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_UPDATE.name),
  loadUploadUser,
  createUpload("applicant-documents").any(),
  applicationParseFormdata,
  applicantDocumentController.uploadApplicantDocuments,
);

/**
 * -----------------------------------------------------------------------------
 * Delete Applicant Document
 * -----------------------------------------------------------------------------
 *
 * Deletes a manager-uploaded document belonging to the specified application.
 * -----------------------------------------------------------------------------
 */

DocumentsRouter.delete(
  "/:applicationId/applicant-documents/:documentId",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_UPDATE.name),
  applicantDocumentController.deleteApplicantDocument,
);

export default DocumentsRouter;
