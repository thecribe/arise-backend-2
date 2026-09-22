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
import interviewNoteController from "./applicant-interview-note.controller.js";

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
  loadUploadUser,
  createUpload("applications").any(),
  applicationParseFormdata,
  validate(createInterviewSchema),
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
  loadUploadUser,
  createUpload("applications").any(),
  applicationParseFormdata,
  validate(createInterviewSchema),
  interviewController.updateInterview,
);

/**
 * --------------------------------------------------------------------------
 * Get Notes By Interview ID
 * --------------------------------------------------------------------------
 */
InterviewRouter.get(
  "/interview/:interviewId/notes",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_VIEW.name),
  interviewNoteController.getNotesByInterviewId,
);

/**
 * --------------------------------------------------------------------------
 * Create Note
 * --------------------------------------------------------------------------
 */
InterviewRouter.post(
  "/interview/:interviewId/notes",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_UPDATE.name),
  interviewNoteController.createNote,
);

/**
 * --------------------------------------------------------------------------
 * Update Note
 * --------------------------------------------------------------------------
 */
InterviewRouter.patch(
  "/interview/notes/:noteId",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_UPDATE.name),
  interviewNoteController.updateNote,
);

/**
 * --------------------------------------------------------------------------
 * Delete Note
 * --------------------------------------------------------------------------
 */
InterviewRouter.delete(
  "/interview/notes/:noteId",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_UPDATE.name),
  interviewNoteController.deleteNote,
);

export default InterviewRouter;
