/**
 * -----------------------------------------------------------------------------
 * File: recruitment.schema.js
 *
 * Description:
 * Zod schemas used to validate Recruitment request data.
 *
 * The applicant list query supports:
 * - Pagination
 * - Applicant search
 * - Job type filtering
 * - Current application phase filtering
 * - Application status filtering
 * -----------------------------------------------------------------------------
 */

import { z } from "zod";

import { APPLICATION_STATUS } from "../../application-definition/constants.js";

/**
 * -----------------------------------------------------------------------------
 * Recruitment applicant query schema.
 * -----------------------------------------------------------------------------
 *
 * Query parameters arrive from Express as strings.
 *
 * z.coerce is therefore used for numeric pagination values.
 */
export const recruitmentApplicantsQuerySchema = z.object({
  /**
   * Current page.
   *
   * Defaults to the first page.
   */
  page: z.coerce.number().int().min(1).default(1),

  /**
   * Number of records returned per page.
   */
  pageSize: z.coerce.number().int().min(1).max(100).default(20),

  /**
   * Search applicant by name.
   */
  search: z.string().trim().optional(),

  /**
   * Filter by JobType.
   *
   * JobType IDs are UUIDs in the database.
   */
  jobTypeId: z.uuid().optional(),

  /**
   * Filter by current application phase.
   *
   * Application phase IDs come from the hardcoded
   * application definition and are strings.
   */
  phaseId: z.string().trim().min(1).optional(),

  /**
   * Filter by the application's current lifecycle status.
   *
   * IN_PROGRESS is the default Recruitment view.
   */
  status: z
    .enum([
      APPLICATION_STATUS.IN_PROGRESS,
      APPLICATION_STATUS.REJECTED,
      APPLICATION_STATUS.APPROVED,
    ])
    .default(APPLICATION_STATUS.IN_PROGRESS),
});
