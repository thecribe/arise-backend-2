import { createAuditContext } from "../../common/audit/audit-context.js";
import { logger } from "../../common/logger/logger.js";
import { ApiResponse } from "../../common/responses/api-response.js";
import { applicationStatusService } from "../recruitment/application-status.service.js";
import {
  updateUserProfile,
  updateUserEmail,
  updateUserPassword,
  updateUserAccountStatus,
  updateUserRole,
  getUserProfile,
  updateUserJobType,
  getOwnUserProfile,
  updateOwnUserProfile,
  updateOwnUserPassword,
} from "./user.service.js";
import {
  updateOwnPasswordSchema,
  updateUserAccountStatusSchema,
  updateUserEmailSchema,
  updateUserPasswordSchema,
  updateUserProfileSchema,
  updateUserRoleSchema,
} from "./user.validation.js";

/**
 * -----------------------------------------------------------------------------
 * User Controller
 * -----------------------------------------------------------------------------
 */

export async function getUserProfileController(req, res) {
  const { applicantId } = req.params;
  const user = await getUserProfile(applicantId);
  return ApiResponse.success(res, user, "User profile updated successfully.");
}
/**
 * Update user profile.
 */
export async function updateUserProfileController(req, res) {
  const { applicantId } = req.params;

  const data = updateUserProfileSchema.parse(req.body);
  const auditContext = createAuditContext(req);

  const user = await updateUserProfile(applicantId, data, auditContext);

  return ApiResponse.success(res, user, "User profile updated successfully.");
}
/**
 * Update user Jobtype.
 */
export async function updateUserJobTypeController(req, res) {
  const { applicantId } = req.params;

  const auditContext = createAuditContext(req);

  const user = await updateUserJobType(applicantId, req.body, auditContext);

  return ApiResponse.success(res, user, "User job type updated successfully.");
}

/**
 * Update user email.
 */
export async function updateUserEmailController(req, res) {
  const { applicantId } = req.params;
  const data = updateUserEmailSchema.parse(req.body);
  const auditContext = createAuditContext(req);

  const user = await updateUserEmail(applicantId, data.email, auditContext);

  return ApiResponse.success(res, user, "User email updated successfully.");
}

/**
 * Update user password.
 */
export async function updateUserPasswordController(req, res) {
  const { applicantId } = req.params;
  const data = updateUserPasswordSchema.parse(req.body);
  const auditContext = createAuditContext(req);

  const result = await updateUserPassword(
    applicantId,
    data.password,
    auditContext,
  );

  return ApiResponse.success(
    res,
    result,
    "User password updated successfully.",
  );
}

/**
 * Update user account status.
 */
export async function updateUserAccountStatusController(req, res) {
  const { applicantId } = req.params;
  const data = updateUserAccountStatusSchema.parse(req.body);
  const auditContext = createAuditContext(req);

  const result = await updateUserAccountStatus(
    applicantId,
    data.isActive,
    auditContext,
  );

  return ApiResponse.success(
    res,
    result,
    "User account status updated successfully.",
  );
}

/**
 * Update user role.
 */
export async function updateUserRoleController(req, res) {
  const { applicantId } = req.params;
  const data = updateUserRoleSchema.parse(req.body);
  const auditContext = createAuditContext(req);

  const user = await updateUserRole(applicantId, data.roleId, auditContext);

  return ApiResponse.success(res, user, "User role updated successfully.");
}

export const getApplicationStatus = async (req, res, next) => {
  try {
    const { applicantId } = req.params;

    const data =
      await applicationStatusService.getApplicationStatus(applicantId);

    return ApiResponse.success(
      res,
      data,
      "Application status retrieved successfully.",
    );
  } catch (error) {
    return next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { applicantId } = req.params;
    const { status, stage, reason } = req.body;
    const auditContext = createAuditContext(req);
    const data = await applicationStatusService.updateApplicationStatus({
      applicantId,
      status,
      stage,
      reason,
      changedBy: req.user?.id,
      auditContext,
    });

    return ApiResponse.success(
      res,
      data,
      "Application status updated successfully.",
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * -----------------------------------------------------------------------------
 * Applicant Self-Service
 * -----------------------------------------------------------------------------
 */

export async function getOwnUserProfileController(req, res) {
  const userId = req.user?.id;

  const user = await getOwnUserProfile(userId);

  return ApiResponse.success(res, user, "Profile retrieved successfully.");
}

export async function updateOwnUserProfileController(req, res) {
  const userId = req.user?.id;

  const data = updateUserProfileSchema.parse(req.body);
  const auditContext = createAuditContext(req);

  const user = await updateOwnUserProfile(userId, data, auditContext);

  return ApiResponse.success(res, user, "Profile updated successfully.");
}

export const updateOwnUserPasswordController = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    const data = updateOwnPasswordSchema.parse(req.body);

    const auditContext = createAuditContext(req);

    const result = await updateOwnUserPassword(userId, data, auditContext);

    return ApiResponse.success(res, result, "Password updated successfully.");
  } catch (error) {
    return next(error);
  }
};
