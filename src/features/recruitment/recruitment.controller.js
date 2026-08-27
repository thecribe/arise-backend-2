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
  updateApplicationSectionStatus,
  createSectionReviewComment,
  updateSectionReviewComment,
  deleteSectionReviewComment,
  updateApplicationPhaseStatus,
} from "./recruitment.service.js";
import {
  createSectionReviewCommentSchema,
  updateApplicationPhaseStatusSchema,
  updateApplicationSectionStatusSchema,
  updateSectionReviewCommentSchema,
} from "./recruitment.validation.js";

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

export async function updateApplicationSectionStatusController(req, res) {
  const { applicationId, sectionId } = req.params;

  const data = updateApplicationSectionStatusSchema.parse(req.body);

  const section = await updateApplicationSectionStatus({
    applicationId,
    sectionId,

    status: data.status,

    comment: data.comment,

    managerId: req.user.id,
  });

  return ApiResponse.success(
    res,
    section,
    "Application section status updated successfully.",
  );
}

/**
 * -----------------------------------------------------------------------------
 * Create Recruitment applicant section review comment
 * -----------------------------------------------------------------------------
 *
 * Creates a new review comment for an application section.
 */
export async function createSectionReviewCommentController(req, res) {
  const { applicationId, sectionId } = req.params;

  const data = createSectionReviewCommentSchema.parse(req.body);

  const comment = await createSectionReviewComment({
    applicationId,
    sectionId,
    comment: data.comment,
    managerId: req.user.id,
  });

  return ApiResponse.success(
    res,
    comment,
    "Review comment created successfully.",
  );
}

/**
 * -----------------------------------------------------------------------------
 * Update Recruitment applicant section review comment
 * -----------------------------------------------------------------------------
 *
 * Updates an existing review comment.
 */
export async function updateSectionReviewCommentController(req, res) {
  const { applicationId, sectionId, commentId } = req.params;

  const data = updateSectionReviewCommentSchema.parse(req.body);

  const comment = await updateSectionReviewComment({
    applicationId,
    sectionId,
    commentId,
    comment: data.comment,
    managerId: req.user.id,
  });

  return ApiResponse.success(
    res,
    comment,
    "Review comment updated successfully.",
  );
}

/**
 * -----------------------------------------------------------------------------
 * Delete Recruitment applicant section review comment
 * -----------------------------------------------------------------------------
 *
 * Deletes an existing review comment.
 */
export async function deleteSectionReviewCommentController(req, res) {
  const { applicationId, sectionId, commentId } = req.params;

  await deleteSectionReviewComment({
    applicationId,
    sectionId,
    commentId,
    managerId: req.user.id,
  });

  return ApiResponse.success(res, null, "Review comment deleted successfully.");
}

/**
 * -----------------------------------------------------------------------------
 * Update Recruitment application phase status.
 *
 * Recruitment Managers control whether a phase is:
 *
 * - locked
 * - in_progress
 * - approved
 *
 * Updating the phase also synchronizes the statuses of all sections belonging
 * to that phase.
 * -----------------------------------------------------------------------------
 */

export async function updateApplicationPhaseStatusController(req, res) {
  const { applicationId, phaseId } = req.params;

  const data = updateApplicationPhaseStatusSchema.parse(req.body);

  const phase = await updateApplicationPhaseStatus({
    applicationId,
    phaseId,
    status: data.status,
  });

  return ApiResponse.success(
    res,
    phase,
    "Application phase status updated successfully.",
  );
}
