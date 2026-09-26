import { createAuditContext } from "../../../../common/audit/audit-context.js";
import { ApiResponse } from "../../../../common/responses/api-response.js";
import { applicantComplianceService } from "./applicant-complaince-forms.service.js";

/**
 * Retrieve all compliance section statuses.
 */
const getSections = async (req, res, next) => {
  try {
    const applicantId = req.user.id;
    const auditContext = createAuditContext(req);
    const sections = await applicantComplianceService.getSections(
      applicantId,
      auditContext,
    );

    return ApiResponse.success(
      res,
      sections,
      "Applicant compliance sections retrieved successfully.",
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve a specific compliance section.
 */
const getSection = async (req, res, next) => {
  try {
    const applicantId = req.user.id;
    const { sectionId } = req.params;
    const auditContext = createAuditContext(req);
    const section = await applicantComplianceService.getSection(
      applicantId,
      sectionId,
      auditContext,
    );

    return ApiResponse.success(
      res,
      section,
      "Applicant compliance section retrieved successfully.",
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Save a compliance section draft.
 */
const saveDraft = async (req, res, next) => {
  try {
    const applicantId = req.user.id;
    const { sectionId } = req.params;
    const auditContext = createAuditContext(req);

    const result = await applicantComplianceService.saveDraft(
      applicantId,
      sectionId,
      req.body,
      auditContext,
    );

    return ApiResponse.success(
      res,
      result,
      "Applicant compliance section draft saved successfully.",
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Submit a compliance section.
 */
const submitSection = async (req, res, next) => {
  try {
    const applicantId = req.user.id;
    const { sectionId } = req.params;
    const auditContext = createAuditContext(req);

    const result = await applicantComplianceService.submitSection(
      applicantId,
      sectionId,
      req.body,
      auditContext,
    );

    return ApiResponse.success(
      res,
      result,
      "Applicant compliance section submitted successfully.",
    );
  } catch (error) {
    next(error);
  }
};

export const applicantComplianceController = {
  getSections,
  getSection,
  saveDraft,
  submitSection,
};
