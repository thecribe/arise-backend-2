import { ApiResponse } from "../../common/responses/api-response.js";
import ApplicationDefinitionService from "../../application-definition/service.js";


export async function getPhases(req, res) {
  const phases = ApplicationDefinitionService.getPhases();

  return ApiResponse.success(
    res,
    phases,
    "Application phases retrieved successfully."
  );
}

export async function getSections(req, res) {
  const { phaseId } = req.params;

  const sections =
    ApplicationDefinitionService.getSections(phaseId);

  return ApiResponse.success(
    res,
    sections,
    "Application sections retrieved successfully."
  );
}