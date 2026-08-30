/**
 * -----------------------------------------------------------------------------
 * File: application-status.controller.js
 *
 * Description:
 *
 * Handles Recruitment Manager application status and stage updates.
 * -----------------------------------------------------------------------------
 */

import { ApiResponse } from "../../common/responses/api-response.js";
import { applicationStatusService } from "./application-status.service.js";

/**
 * -----------------------------------------------------------------------------
 * Update application status and/or stage.
 * -----------------------------------------------------------------------------
 */

const updateApplicationStatusController = async (req, res) => {
  const { applicationId } = req.params;

  console.log(req.body);

  const result = await applicationStatusService.updateApplicationStatus({
    applicantId: applicationId,

    status: req.body.status,

    stage: req.body.stage,

    reason: req.body.reason,

    changedBy: req.user.id,
  });

  return ApiResponse.success(
    res,
    result,
    "Application status updated successfully.",
  );
};

/**
 * -----------------------------------------------------------------------------
 * Get Current Applicant Application Status.
 * -----------------------------------------------------------------------------
 */

const getApplicantApplicationStatus = async (req, res, next) => {
  const applicantId = req.user.id;

  const applicationStatus =
    await applicationStatusService.getApplicationStatusByApplicantId(
      applicantId,
    );

  return ApiResponse.success(
    res,
    applicationStatus,
    "Application status retrieved successfully.",
  );
};

export const applicationStatusController = {
  updateApplicationStatusController,
  getApplicantApplicationStatus,
};
