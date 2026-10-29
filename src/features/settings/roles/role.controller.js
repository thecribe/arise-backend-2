import { createAuditContext } from "../../../common/audit/audit-context.js";
import { ApiResponse } from "../../../common/responses/api-response.js";
import { roleService } from "./role.service.js";

const getAllRoles = async (req, res, next) => {
  try {
    const roles = await roleService.getAllRoles();

    return ApiResponse.success(res, roles, "Roles retrieved successfully.");
  } catch (error) {
    next(error);
  }
};

const getRoleById = async (req, res, next) => {
  try {
    const role = await roleService.getRoleById(req.params.id);

    return ApiResponse.success(res, role, "Role retrieved successfully.");
  } catch (error) {
    next(error);
  }
};

const getPermissions = async (req, res, next) => {
  try {
    const permissions = await roleService.getPermissions();

    return ApiResponse.success(
      res,
      permissions,
      "Permissions retrieved successfully.",
    );
  } catch (error) {
    next(error);
  }
};

const createRole = async (req, res, next) => {
  try {
    const auditContext = createAuditContext(req);

    const role = await roleService.createRole({
      ...req.body,
      auditContext,
    });

    return ApiResponse.success(res, role, "Role created successfully.");
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const auditContext = createAuditContext(req);

    const role = await roleService.updateRole({
      roleId: req.params.id,
      ...req.body,
      auditContext,
    });

    return ApiResponse.success(res, role, "Role updated successfully.");
  } catch (error) {
    next(error);
  }
};

const updateRolePermissions = async (req, res, next) => {
  try {
    const auditContext = createAuditContext(req);

    const role = await roleService.updateRolePermissions({
      roleId: req.params.id,
      ...req.body,
      auditContext,
    });

    return ApiResponse.success(
      res,
      role,
      "Role permissions updated successfully.",
    );
  } catch (error) {
    next(error);
  }
};

const deleteRole = async (req, res, next) => {
  try {
    const auditContext = createAuditContext(req);

    const result = await roleService.deleteRole({
      roleId: req.params.id,
      auditContext,
    });

    return ApiResponse.success(res, result, "Role deleted successfully.");
  } catch (error) {
    next(error);
  }
};

export default {
  getAllRoles,
  getRoleById,
  getPermissions,
  createRole,
  updateRole,
  updateRolePermissions,
  deleteRole,
};
