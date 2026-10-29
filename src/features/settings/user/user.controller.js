import { createAuditContext } from "../../../common/audit/audit-context.js";
import { ApiResponse } from "../../../common/responses/api-response.js";
import { userService } from "./user.service.js";

/**
 * Get all manageable users.
 * Supports pagination, search, role filtering, and account status.
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers({
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
      roleId: req.query.roleId,
      isActive:
        req.query.isActive === undefined
          ? undefined
          : req.query.isActive === "true",
    });

    return ApiResponse.success(res, users, "Users retrieved successfully.");
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single manageable user.
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);

    return ApiResponse.success(res, user, "User retrieved successfully.");
  } catch (error) {
    next(error);
  }
};

/**
 * Get roles available for assignment in Settings.
 */
const getAssignableRoles = async (req, res, next) => {
  try {
    const roles = await userService.getAssignableRoles();

    return ApiResponse.success(
      res,
      roles,
      "Assignable roles retrieved successfully.",
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Create a user.
 */
const createUser = async (req, res, next) => {
  try {
    const auditContext = createAuditContext(req);

    const user = await userService.createUser({
      ...req.body,
      actorId: req.user?.id,
      auditContext,
    });

    return ApiResponse.success(res, user, "User created successfully.");
  } catch (error) {
    next(error);
  }
};

/**
 * Update user details.
 */
const updateUser = async (req, res, next) => {
  try {
    const auditContext = createAuditContext(req);

    const user = await userService.updateUser({
      userId: req.params.id,
      ...req.body,
      actorId: req.user?.id,
      auditContext,
    });

    return ApiResponse.success(res, user, "User updated successfully.");
  } catch (error) {
    next(error);
  }
};

/**
 * Change a user's assigned role.
 */
const updateUserRole = async (req, res, next) => {
  try {
    const auditContext = createAuditContext(req);

    const user = await userService.updateUserRole({
      userId: req.params.id,
      roleId: req.body.roleId,
      actorId: req.user?.id,
      auditContext,
    });

    return ApiResponse.success(res, user, "User role updated successfully.");
  } catch (error) {
    next(error);
  }
};

/**
 * Activate or deactivate a user account.
 */
const updateUserStatus = async (req, res, next) => {
  try {
    const auditContext = createAuditContext(req);

    const user = await userService.updateUserStatus({
      userId: req.params.id,
      isActive: req.body.isActive,
      actorId: req.user?.id,
      auditContext,
    });

    return ApiResponse.success(
      res,
      user,
      `User ${req.body.isActive ? "activated" : "deactivated"} successfully.`,
    );
  } catch (error) {
    next(error);
  }
};

export default {
  getAllUsers,
  getUserById,
  getAssignableRoles,
  createUser,
  updateUser,
  updateUserRole,
  updateUserStatus,
};
