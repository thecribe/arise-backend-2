import { createAuditContext } from "../../common/audit/audit-context.js";
import { ApiResponse } from "../../common/responses/api-response.js";
import interviewService from "./applicant-interview.service.js";

/**
 * --------------------------------------------------------------------------
 * Get Interview By Application ID
 * --------------------------------------------------------------------------
 */

const getInterview = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    const interview =
      await interviewService.getInterviewByApplicationId(applicationId);

    return ApiResponse.success(
      res,
      interview,
      "Interview retrieved successfully.",
    );
  } catch (error) {
    next(error);
  }
};

const createInterview = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    const interviewerId = req.user.id;

    const auditContext = createAuditContext(req);

    const interview = await interviewService.createInterview(
      applicationId,
      interviewerId,
      req.body,
      auditContext,
    );

    return ApiResponse.success(
      res,
      interview,
      "Interview created successfully.",
    );
  } catch (error) {
    next(error);
  }
};

const updateInterview = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    const interviewerId = req.user.id;

    const auditContext = createAuditContext(req);

    const interview = await interviewService.updateInterview(
      applicationId,
      interviewerId,
      req.body,
      auditContext,
    );

    return ApiResponse.success(
      res,
      interview,
      "Interview updated successfully.",
    );
  } catch (error) {
    next(error);
  }
};

const interviewController = {
  getInterview,
  createInterview,
  updateInterview,
};

export default interviewController;
