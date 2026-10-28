import { Router } from "express";

import { declarationsController } from "./declarations.controller.js";
import { authenticate } from "../../common/middleware/authenticate.js";
import { authorize } from "../../common/middleware/authorize.js";
import { PERMISSIONS } from "../../common/constants/permissions.js";
import { loadUploadUser } from "../../common/middleware/load-applicant.js";
import createUpload from "../../common/middleware/createUpload.js";
import { applicationParseFormdata } from "../../common/middleware/applicationParseFormData.js";

const DeclarationsRouter = Router();

/**
 * ---------------------------------------------------------------------------
 * Get declaration definitions
 * ---------------------------------------------------------------------------
 */
DeclarationsRouter.get(
  "/:applicationId",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_VIEW.name),
  declarationsController.getDeclarations,
);

/**
 * ---------------------------------------------------------------------------
 * Get saved declaration values
 * ---------------------------------------------------------------------------
 */
DeclarationsRouter.get(
  "/:applicationId/values",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_VIEW.name),
  declarationsController.getDeclarationValues,
);

/**
 * ---------------------------------------------------------------------------
 * Create / update declaration values
 * ---------------------------------------------------------------------------
 */
DeclarationsRouter.put(
  "/:applicationId/:sectionId",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_VIEW.name),
  loadUploadUser,
  createUpload("declarations").any(),
  applicationParseFormdata,
  declarationsController.saveDeclaration,
);

DeclarationsRouter.get(
  "/:applicationId/:sectionId/status",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_VIEW.name),
  declarationsController.getApplicationSectionStatusController,
);

DeclarationsRouter.patch(
  "/:applicationId/:sectionId/status",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_VIEW.name),
  declarationsController.updateStatus,
);

export default DeclarationsRouter;
