import { Router } from "express";
import { authenticate } from "../../common/middleware/authenticate.js";
import { authorize } from "../../common/middleware/authorize.js";
import interviewController from "./applicant-interview.controller.js";
import { loadUploadUser } from "../../common/middleware/load-applicant.js";
import { applicationParseFormdata } from "../../common/middleware/applicationParseFormData.js";
import createUpload from "../../common/middleware/createUpload.js";
import { PERMISSIONS } from "../../common/constants/permissions.js";
import { createInterviewSchema } from "./schemas/interview.schema.js";
import { validate } from "../../common/middleware/validate.js";

const InterviewRouter = Router();

/**
 * --------------------------------------------------------------------------
 * Get Interview By Application ID
 * --------------------------------------------------------------------------
 */
InterviewRouter.get(
  "/interview/:applicationId/",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_VIEW.name),
  interviewController.getInterview,
);

/**
 * --------------------------------------------------------------------------
 * Create Interview
 * --------------------------------------------------------------------------
 */
InterviewRouter.post(
  "/interview/:applicationId",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_UPDATE.name),
  validate(createInterviewSchema),
  loadUploadUser,
  createUpload().any(),
  applicationParseFormdata,
  interviewController.createInterview,
);

/**
 * --------------------------------------------------------------------------
 * Update Interview
 * --------------------------------------------------------------------------
 */
InterviewRouter.patch(
  "/interview/:applicationId",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_UPDATE.name),
  validate(createInterviewSchema),
  loadUploadUser,
  createUpload().any(),
  applicationParseFormdata,
  interviewController.updateInterview,
);

export default InterviewRouter;
