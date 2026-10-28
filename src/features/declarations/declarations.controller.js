/**
 * -----------------------------------------------------------------------------
 * File: declarations.controller.js
 *
 * Description:
 * Handles requests for applicant declaration definitions.
 * -----------------------------------------------------------------------------
 */

import { createAuditContext } from "../../common/audit/audit-context.js";
import { ApiResponse } from "../../common/responses/api-response.js";
import { declarationsService } from "./declarations.service.js";

const getDeclarations = async (req, res) => {
  const { applicationId } = req.params;

  const declarations = await declarationsService.getDeclarations(applicationId);

  return ApiResponse.success(
    res,
    declarations,
    "Applicant declarations retrieved successfully.",
  );
};

const getDeclarationValues = async (req, res) => {
  const { applicationId } = req.params;

  const values = await declarationsService.getDeclarationValues(applicationId);

  return ApiResponse.success(
    res,
    values,
    "Applicant declaration values retrieved successfully.",
  );
};

const saveDeclaration = async (req, res) => {
  const { applicationId, sectionId } = req.params;

  const auditContext = createAuditContext(req);

  const result = await declarationsService.saveDeclaration({
    applicationId,
    sectionId,
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
  const { applicationId, sectionId } = req.params;

  const result = await declarationsService.getApplicationSectionStatus({
    applicationId,
    sectionId,
  });

  return ApiResponse.success(
    res,
    result,
    "Application section status retrieved successfully.",
  );
};

const updateStatus = async (req, res) => {
  const { applicationId, sectionId } = req.params;

  const result =
    await declarationsService.updateApplicationSectionStatusService({
      applicationId,
      sectionId,
      status: req.body.status,
    });

  return ApiResponse.success(
    res,
    result,
    "Application section status updated successfully.",
  );
};

export const declarationsController = {
  getDeclarations,
  getDeclarationValues,
  saveDeclaration,
  getApplicationSectionStatusController,
  updateStatus,
};
