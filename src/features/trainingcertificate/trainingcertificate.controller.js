import { createAuditContext } from "../../common/audit/audit-context.js";
import { ApiResponse } from "../../common/responses/api-response.js";
import { trainingCertificateService } from "./trainingcertificate.service.js";

const getTrainingCertificateRequirements = async (req, res, next) => {
  try {
    const includeInactive = req.query.includeInactive === "true";

    const requirements =
      await trainingCertificateService.getTrainingCertificateRequirements({
        includeInactive,
      });

    return ApiResponse.success(
      res,
      requirements,
      "Training certificate requirements retrieved successfully.",
    );
  } catch (error) {
    next(error);
  }
};

const getTrainingCertificateRequirementById = async (req, res, next) => {
  try {
    const { requirementId } = req.params;

    const requirement =
      await trainingCertificateService.getTrainingCertificateRequirementById(
        requirementId,
      );

    return ApiResponse.success(
      res,
      requirement,
      "Training certificate requirement retrieved successfully.",
    );
  } catch (error) {
    next(error);
  }
};

const createTrainingCertificateRequirement = async (req, res, next) => {
  try {
    const auditContext = createAuditContext(req);

    const requirement =
      await trainingCertificateService.createTrainingCertificateRequirement(
        req.body,
        auditContext,
      );

    return ApiResponse.success(
      res,
      requirement,
      "Training certificate requirement created successfully.",
    );
  } catch (error) {
    next(error);
  }
};

const updateTrainingCertificateRequirement = async (req, res, next) => {
  try {
    const { requirementId } = req.params;
    const auditContext = createAuditContext(req);

    const requirement =
      await trainingCertificateService.updateTrainingCertificateRequirement(
        requirementId,
        req.body,
        auditContext,
      );

    return ApiResponse.success(
      res,
      requirement,
      "Training certificate requirement updated successfully.",
    );
  } catch (error) {
    next(error);
  }
};

const updateTrainingCertificateRequirementStatus = async (req, res, next) => {
  try {
    const { requirementId } = req.params;
    const { active } = req.body;
    const auditContext = createAuditContext(req);

    const requirement =
      await trainingCertificateService.updateTrainingCertificateRequirementStatus(
        requirementId,
        active,
        auditContext,
      );

    return ApiResponse.success(
      res,
      requirement,
      "Training certificate requirement status updated successfully.",
    );
  } catch (error) {
    next(error);
  }
};

export default {
  getTrainingCertificateRequirements,
  getTrainingCertificateRequirementById,
  createTrainingCertificateRequirement,
  updateTrainingCertificateRequirement,
  updateTrainingCertificateRequirementStatus,
};
