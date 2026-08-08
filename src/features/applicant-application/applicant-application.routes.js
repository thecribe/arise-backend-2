import { Router } from "express";

import { authenticate } from "../../common/middleware/authenticate.js";
import { authorize } from "../../common/middleware/authorize.js";
import { PERMISSIONS } from "../../common/constants/permissions.js";

import { applicantApplicationController } from "./applicant-application.controller.js";

const router = Router();

/**
 * Retrieve the authenticated applicant's application.
 */
router.get(
  "/",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_VIEW.name),
  applicantApplicationController.getApplicantApplication,
);

export { router as applicantApplicationRouter };