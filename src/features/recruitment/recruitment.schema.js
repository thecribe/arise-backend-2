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

export const createRecruitmentApplicantSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters")
      .max(100),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters")
      .max(100),

    email: z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .max(255),

    phoneNumber: z
      .string()
      .trim()
      .min(10, "Please enter a valid phone number")
      .max(30),

    address: z
      .string()
      .trim()
      .min(5, "Address must be at least 5 characters")
      .max(255),

    postcode: z.string().trim().min(3, "Please enter a valid postcode").max(30),

    jobTypeId: z.string().uuid("Please select a valid job type"),
  })
  .strict();
