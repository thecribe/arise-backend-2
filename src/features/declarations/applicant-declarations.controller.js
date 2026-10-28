import { createAuditContext } from "../../common/audit/audit-context.js";
import { logger } from "../../common/logger/logger.js";
import { ApiResponse } from "../../common/responses/api-response.js";
import { applicantDeclarationsService } from "./applicant-declarations.service.js";

const getDeclarations = async (req, res) => {
  const result = await applicantDeclarationsService.getDeclarations({
    applicantId: req.user.id,
  });

  return ApiResponse.success(
    res,
    result,
    "Applicant declarations retrieved successfully.",
  );
};

const getDeclarationValues = async (req, res) => {
  const result = await applicantDeclarationsService.getDeclarationValues({
    applicantId: req.user.id,
  });

  return ApiResponse.success(
    res,
    result,
    "Applicant declaration values retrieved successfully.",
  );
};

const saveDeclaration = async (req, res) => {
  const { declarationId } = req.params;

  const auditContext = createAuditContext(req);

  const result = await applicantDeclarationsService.saveDeclaration({
    applicantId: req.user.id,
    sectionId: declarationId,
    values: req.body,
    changedBy: req.user.id,
    auditContext,
  });

  return ApiResponse.success(
    res,
    result,
    "Applicant declaration saved successfully.",
  );
};

const getApplicationSectionStatusController = async (req, res) => {
  const result =
    await applicantDeclarationsService.getApplicantApplicationSectionStatus({
      applicantId: req.user.id,
      sectionId: req.params.sectionId,
    });

  return ApiResponse.success(
    res,
    result,
    "Application section status retrieved successfully.",
  );
};

export default {
  getDeclarations,
  getDeclarationValues,
  saveDeclaration,
  getApplicationSectionStatusController,
};
