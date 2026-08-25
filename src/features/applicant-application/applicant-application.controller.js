import { ApiResponse } from "../../common/responses/api-response.js";
import * as applicantApplicationService from "./applicant-application.service.js";

const getApplicantApplication = async (req, res) => {
  const applicantId = req.user.id;

  const application =
    await applicantApplicationService.getApplicantApplication(applicantId);

  return ApiResponse.success(
    res,
    application,
    "Applicant application retrieved successfully.",
  );
};
const getSectionValues = async (req, res) => {
  const applicantId = req.user.id;

  const { sectionId } = req.params;

  const sectionValues = await applicantApplicationService.getSectionValues(
    applicantId,
    sectionId,
  );

  return ApiResponse.success(
    res,
    sectionValues,
    "Application section values retrieved successfully.",
  );
};

const saveSectionDraft = async (req, res) => {
  const applicantId = req.user.id;

  const { sectionId } = req.params;

  const sectionValues = await applicantApplicationService.saveSectionDraft(
    applicantId,
    sectionId,
    req.body,
  );

  return ApiResponse.success(
    res,
    sectionValues,
    "Application section draft saved successfully.",
  );
};

const submitSection = async (req, res) => {
  const applicantId = req.user.id;

  const { sectionId } = req.params;

  const result = await applicantApplicationService.submitSection(
    applicantId,
    sectionId,
  );

  return ApiResponse.success(
    res,
    result,
    "Application section submitted successfully.",
  );
};

/**
 * -----------------------------------------------------------------------------
 * Get review comments for the authenticated applicant's application section.
 *
 * The frontend only provides the section ID.
 *
 * The applicant ID is obtained from the authenticated user.
 * -----------------------------------------------------------------------------
 */

const getApplicantSectionReviewCommentsController = async (req, res) => {
  const { sectionId } = req.params;

  const comments =
    await applicantApplicationService.getApplicantSectionReviewComments(
      req.user.id,
      sectionId,
    );

  return ApiResponse.success(
    res,
    comments,
    "Application section review comments retrieved successfully.",
  );
};

export const applicantApplicationController = {
  getApplicantApplication,
  getSectionValues,
  saveSectionDraft,
  submitSection,
  getApplicantSectionReviewCommentsController,
};
