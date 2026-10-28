import { Router } from "express";

import { authenticate } from "../../common/middleware/authenticate.js";
import { authorize } from "../../common/middleware/authorize.js";
import { PERMISSIONS } from "../../common/constants/permissions.js";
import { loadUploadUser } from "../../common/middleware/load-applicant.js";
import createUpload from "../../common/middleware/createUpload.js";
import { applicationParseFormdata } from "../../common/middleware/applicationParseFormData.js";
import applicantDeclarationsController from "./applicant-declarations.controller.js";

const ApplicantDeclarationsRouter = Router();

ApplicantDeclarationsRouter.get(
  "/declarations",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_VIEW.name),
  applicantDeclarationsController.getDeclarations,
);

ApplicantDeclarationsRouter.get(
  "/declarations/values",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_VIEW.name),
  applicantDeclarationsController.getDeclarationValues,
);

ApplicantDeclarationsRouter.put(
  "/declarations/:declarationId",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_VIEW.name),
  loadUploadUser,
  createUpload("declarations").any(),
  applicationParseFormdata,
  applicantDeclarationsController.saveDeclaration,
);

ApplicantDeclarationsRouter.get(
  "/declarations/:sectionId/status",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_VIEW.name),
  applicantDeclarationsController.getApplicationSectionStatusController,
);
export default ApplicantDeclarationsRouter;
