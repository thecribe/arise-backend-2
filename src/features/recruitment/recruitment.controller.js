/**
 * -----------------------------------------------------------------------------
 * File: recruitment.controller.js
 *
 * Description:
 * HTTP controllers for the Recruitment feature.
 *
 * Controllers are intentionally thin.
 * Business logic belongs in recruitment.service.js.
 * -----------------------------------------------------------------------------
 */

import { ApiResponse } from "../../common/responses/api-response.js";
import { recruitmentApplicantsQuerySchema } from "./recruitment.schema.js";
import {
  getRecruitmentDefaultData,
  getRecruitmentApplicants,
  getRecruitmentApplicant,
  getRecruitmentApplicantSection,
} from "./recruitment.service.js";

/**
 * -----------------------------------------------------------------------------
 * Get Recruitment default data.
 * -----------------------------------------------------------------------------
 *
 * Returns:
 *
 * - Job types
 * - Application phases
 */
export async function getRecruitmentDefaultDataController(req, res) {
  const defaultData = await getRecruitmentDefaultData();

  return ApiResponse.success(
    res,
    defaultData,
    "Recruitment default data retrieved successfully.",
  );
}

/**
 * -----------------------------------------------------------------------------
 * Get Recruitment applicants.
 * -----------------------------------------------------------------------------
 *
 * Query parameters are passed to the Recruitment service.
 */
export async function getRecruitmentApplicantsController(req, res) {
  /**
   * Parse and validate the incoming query.
   *
   * This also applies the default values for:
   *
   * - page
   * - pageSize
   * - status
   */
  const query = recruitmentApplicantsQuerySchema.parse(req.query);
  const applicants = await getRecruitmentApplicants(query);

  return ApiResponse.success(
    res,
    applicants,
    "Recruitment applicants retrieved successfully.",
  );
}

/**
 * -----------------------------------------------------------------------------
 * Get a single Recruitment applicant.
 * -----------------------------------------------------------------------------
 *
 * Route:
 *
 * GET /recruitment/applicants/:id
 *
 * The ID represents the ApplicantApplication ID.
 *
 * The response intentionally contains only lightweight application information.
 *
 * Detailed section fields and applicant values are loaded separately.
 */
export async function getRecruitmentApplicantController(req, res) {
  const { id } = req.params;

  const applicant = await getRecruitmentApplicant(id);

  return ApiResponse.success(
    res,
    applicant,
    "Recruitment applicant retrieved successfully.",
  );
}

/**
 * -----------------------------------------------------------------------------
 * Get a single Recruitment application section.
 * -----------------------------------------------------------------------------
 *
 * This endpoint intentionally loads only the selected section.
 *
 * The response contains:
 *
 * - Section definition
 * - Applicant section status
 * - Applicant submitted values
 * - Review comments
 *
 * Fields and values for other sections are not loaded.
 */
export async function getRecruitmentApplicantSectionController(req, res) {
  const { applicationId, sectionId } = req.params;

  const section = await getRecruitmentApplicantSection(
    applicationId,
    sectionId,
  );

  return ApiResponse.success(
    res,
    section,
    "Recruitment application section retrieved successfully.",
  );
}
