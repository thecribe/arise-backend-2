import { createAuditContext } from "../../common/audit/audit-context.js";
import { ApiResponse } from "../../common/responses/api-response.js";
import { applicationStatusService } from "./application-status.service.js";

const updateApplicationStatusController = async (req, res) => {
  const { applicationId } = req.params;

  const auditContext = createAuditContext(req);

  const result = await applicationStatusService.updateApplicationStatus({
    applicantId: applicationId,
    status: req.body.status,
    stage: req.body.stage,
    reason: req.body.reason,
    changedBy: req.user.id,
    auditContext,
  });

  return ApiResponse.success(
    res,
    result,
    "Application status updated successfully.",
  );
};

const getApplicantApplicationStatus = async (req, res) => {
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
