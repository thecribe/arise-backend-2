/**
 * -----------------------------------------------------------------------------
 * File: recruitment.router.js
 *
 * Description:
 * Routes for the Recruitment feature.
 * -----------------------------------------------------------------------------
 */

import { Router } from "express";

import {
  getRecruitmentDefaultDataController,
  getRecruitmentApplicantsController,
  getRecruitmentApplicantController,
  getRecruitmentApplicantSectionController,
  updateApplicationSectionStatusController,
  createSectionReviewCommentController,
  updateSectionReviewCommentController,
  deleteSectionReviewCommentController,
  updateApplicationPhaseStatusController,
  saveApplicationForm,
} from "./recruitment.controller.js";
import { authenticate } from "../../common/middleware/authenticate.js";
import { PERMISSIONS } from "../../common/constants/permissions.js";
import { authorize } from "../../common/middleware/authorize.js";
import { loadUploadUser } from "../../common/middleware/load-applicant.js";
import createUpload from "../../common/middleware/createUpload.js";
import { applicationParseFormdata } from "../../common/middleware/applicationParseFormData.js";
import { validate } from "../../common/middleware/validate.js";
import { updateApplicationStatusSchema } from "./application-status.schema.js";
import { applicationStatusController } from "./application-status.controller.js";

const recruitmentRouter = Router();

/**
 * -----------------------------------------------------------------------------
 * Recruitment default data
 * -----------------------------------------------------------------------------
 *
 * Provides the frontend with:
 *
 * - Job types
 * - Application phases
 *
 * Requires:
 * RECRUITMENT_VIEW
 */
recruitmentRouter.get(
  "/default-data",
  authenticate,
  authorize(PERMISSIONS.RECRUITMENT_VIEW.name),
  getRecruitmentDefaultDataController,
);

/**
 * -----------------------------------------------------------------------------
 * Recruitment applicants
 * -----------------------------------------------------------------------------
 *
 * Supports:
 *
 * - Search
 * - Job type filtering
 * - Current phase filtering
 * - Application status filtering
 * - Pagination
 *
 * Requires:
 * RECRUITMENT_VIEW
 */
recruitmentRouter.get(
  "/applicants",
  authenticate,
  authorize(PERMISSIONS.RECRUITMENT_VIEW.name),
  getRecruitmentApplicantsController,
);

/**
 * -----------------------------------------------------------------------------
 * Single Recruitment applicant
 * -----------------------------------------------------------------------------
 *
 * Returns:
 *
 * - Applicant profile
 * - Job type
 * - Current application status
 * - Current application phase
 * - Current application section
 * - Application progress
 * - Application phases
 * - Lightweight section summaries
 *
 * Does NOT return:
 *
 * - Section field values
 * - Repeatable section entries
 * - Section comments
 *
 * Those are loaded by the selected-section endpoint.
 *
 * Requires:
 * RECRUITMENT_VIEW
 */
recruitmentRouter.get(
  "/applicants/:id",
  authenticate,
  authorize(PERMISSIONS.RECRUITMENT_VIEW.name),
  getRecruitmentApplicantController,
);

/**
 * -----------------------------------------------------------------------------
 * Recruitment applicant section
 * -----------------------------------------------------------------------------
 *
 * Returns the complete data required to review ONE application section.
 *
 * The endpoint intentionally does not return fields/values for the applicant's
 * other sections.
 *
 * Requires:
 * RECRUITMENT_VIEW
 */
recruitmentRouter.get(
  "/applicants/:applicationId/sections/:sectionId",
  authenticate,
  authorize(PERMISSIONS.RECRUITMENT_VIEW.name),
  getRecruitmentApplicantSectionController,
);

recruitmentRouter.patch(
  "/applications/:applicationId/sections/:sectionId/status",
  authenticate,
  authorize(
    PERMISSIONS.RECRUITMENT_VIEW.name,
    PERMISSIONS.RECRUITMENT_APPROVE.name,
  ),
  updateApplicationSectionStatusController,
);

/**
 * -----------------------------------------------------------------------------
 * Create Recruitment applicant section review comment
 * -----------------------------------------------------------------------------
 *
 * Allows a Recruitment Manager to add a review comment to an application
 * section.
 *
 * Requires:
 *
 * RECRUITMENT_VIEW
 */
recruitmentRouter.post(
  "/applications/:applicationId/sections/:sectionId/comments",

  authenticate,

  authorize(PERMISSIONS.RECRUITMENT_VIEW.name),

  createSectionReviewCommentController,
);

/**
 * -----------------------------------------------------------------------------
 * Update Recruitment applicant section review comment
 * -----------------------------------------------------------------------------
 *
 * Allows the creator of a review comment to update it.
 *
 * Requires:
 *
 * RECRUITMENT_VIEW
 */
recruitmentRouter.patch(
  "/applications/:applicationId/sections/:sectionId/comments/:commentId",

  authenticate,

  authorize(PERMISSIONS.RECRUITMENT_VIEW.name),

  updateSectionReviewCommentController,
);

/**
 * -----------------------------------------------------------------------------
 * Delete Recruitment applicant section review comment
 * -----------------------------------------------------------------------------
 *
 * Allows the creator of a review comment to delete it.
 *
 * Requires:
 *
 * RECRUITMENT_VIEW
 */
recruitmentRouter.delete(
  "/applications/:applicationId/sections/:sectionId/comments/:commentId",

  authenticate,

  authorize(PERMISSIONS.RECRUITMENT_VIEW.name),

  deleteSectionReviewCommentController,
);

export { recruitmentRouter };

/**
 * -----------------------------------------------------------------------------
 * Update application phase status.
 *
 * Recruitment Managers control:
 *
 * - locking a phase
 * - starting/reopening a phase
 * - approving a phase
 *
 * When a phase becomes in_progress:
 *
 * - Missing section records are created.
 * - All sections in the phase become in_progress.
 *
 * When a phase becomes approved:
 *
 * - All sections in the phase become approved.
 *
 * Requires:
 *
 * - RECRUITMENT_VIEW
 * - RECRUITMENT_APPROVE
 * -----------------------------------------------------------------------------
 */

recruitmentRouter.patch(
  "/applications/:applicationId/phases/:phaseId/status",

  authenticate,

  authorize(
    PERMISSIONS.RECRUITMENT_VIEW.name,
    PERMISSIONS.RECRUITMENT_APPROVE.name,
  ),

  updateApplicationPhaseStatusController,
);

recruitmentRouter.put(
  "/applications/:applicationId/sections/:sectionId/submit",

  authenticate,

  authorize(
    PERMISSIONS.RECRUITMENT_VIEW.name,
    PERMISSIONS.RECRUITMENT_APPROVE.name,
  ),
  loadUploadUser,
  createUpload("applications").any(),
  applicationParseFormdata,

  saveApplicationForm,
);

recruitmentRouter.patch(
  "/applications/:applicationId/status",

  authenticate,

  authorize(
    PERMISSIONS.RECRUITMENT_VIEW.name,
    PERMISSIONS.RECRUITMENT_APPROVE.name,
  ),
  validate(updateApplicationStatusSchema),

  applicationStatusController.updateApplicationStatusController,
);

recruitmentRouter.get(
  "/application-status/me",
  authenticate,
  applicationStatusController.getApplicantApplicationStatus,
);
