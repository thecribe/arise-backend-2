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
} from "./recruitment.controller.js";
import { authenticate } from "../../common/middleware/authenticate.js";
import { PERMISSIONS } from "../../common/constants/permissions.js";
import { authorize } from "../../common/middleware/authorize.js";

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
