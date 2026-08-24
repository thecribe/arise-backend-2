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

export const applicantApplicationController = {
  getApplicantApplication,
  getSectionValues,
  saveSectionDraft,
  submitSection,
};
