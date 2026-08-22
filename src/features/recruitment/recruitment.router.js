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

export { recruitmentRouter };
