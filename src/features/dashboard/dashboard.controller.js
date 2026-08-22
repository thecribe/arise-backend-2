import { ApiResponse } from "../../common/responses/api-response.js";
import { getApplicantDashboard } from "./dashboard.service.js";

export async function getApplicantDashboardData(req, res) {
  const applicantId = req.user.id;

  const dashboard = await getApplicantDashboard(
    applicantId,
  );

  return ApiResponse.success(
    res,
    dashboard,
    "Applicant dashboard retrieved successfully.",
  );
}