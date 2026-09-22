/**
 * -----------------------------------------------------------------------------
 * File: documents.route.js
 *
 * Description:
 * Routes for manager-generated application documents.
 * -----------------------------------------------------------------------------
 */

import { Router } from "express";
import documentsController from "./documents.controller.js";
import { authenticate } from "../../common/middleware/authenticate.js";
import { authorize } from "../../common/middleware/authorize.js";
import { PERMISSIONS } from "../../common/constants/permissions.js";

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
 */

DocumentsRouter.get(
  "/:applicationId/application-form",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_VIEW.name),
  documentsController.getApplicationFormDocument,
);

export default DocumentsRouter;
