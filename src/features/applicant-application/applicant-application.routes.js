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

/**
 * Retrieve saved values for an application section.
 */
router.get(
  "/sections/:sectionId/values",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_VIEW.name),
  applicantApplicationController.getSectionValues,
);

/**
 * Save application section draft.
 */
router.patch(
  "/sections/:sectionId/values",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_UPDATE.name),
  applicantApplicationController.saveSectionDraft,
);

/**
 * Submit an application section.
 */
router.post(
  "/sections/:sectionId/submit",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_SUBMIT.name),
  applicantApplicationController.submitSection,
);

export { router as applicantApplicationRouter };