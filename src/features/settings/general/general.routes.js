import { Router } from "express";

import generalController from "./general.controller.js";
import { authenticate } from "../../../common/middleware/authenticate.js";
import { authorize } from "../../../common/middleware/authorize.js";
import { loadUploadUser } from "../../../common/middleware/load-applicant.js";
import createSettingsUpload from "../utils/createSettingsUpload.js";
import { applicationParseFormdata } from "../../../common/middleware/applicationParseFormData.js";
import { PERMISSIONS } from "../../../common/constants/permissions.js";

const generalRouter = Router();

/**
 * Retrieve the current organisation settings.
 */
generalRouter.get(
  "/",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_VIEW.name),
  generalController.getGeneralSettings,
);

/**
 * Update the current organisation settings.
 */
generalRouter.patch(
  "/",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_VIEW.name),
  loadUploadUser,
  createSettingsUpload("site-settings").any(),
  applicationParseFormdata,
  generalController.updateGeneralSettings,
);

export default generalRouter;
