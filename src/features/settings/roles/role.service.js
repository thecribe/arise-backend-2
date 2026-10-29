/**
 * -----------------------------------------------------------------------------
 * File: role.service.js
 *
 * Description:
 *
 * Handles role management and system permission assignments.
 * System roles cannot be edited or deleted.
 * Custom role changes and audit records are managed transactionally.
 * -----------------------------------------------------------------------------
 */

import { AUDIT_ACTIONS } from "../../../common/constants/audit-actions.js";
import { AUDIT_ENTITY_TYPES } from "../../../common/constants/audit-entity-types.js";
import { ConflictError } from "../../../common/errors/conflict-error.js";
import { NotFoundError } from "../../../common/errors/not-found-error.js";
import { sequelize } from "../../../config/database.js";
import { Permission } from "../../../database/models/Permission.js";
import { Role } from "../../../database/models/Role.js";
import { User } from "../../../database/models/User.js";

import { recordAuditAction } from "../../audit/record-audit-action.js";
import { roleRepository } from "./role.repository.js";

/**
 * -----------------------------------------------------------------------------
 * Helpers
 * -----------------------------------------------------------------------------
 */

const assertCustomRole = (role) => {
  if (role.is_system) {
    throw new ConflictError("System roles cannot be edited or deleted.");
  }
};

const assertPermissionsExist = async (permissionIds, transaction) => {
  const permissions = await roleRepository.findPermissionsByIds(
    permissionIds,
    transaction,
  );

  if (permissions.length !== permissionIds.length) {
    throw new ConflictError("One or more selected permissions do not exist.");
  }

  return permissions;
};

const getRoleOrThrow = async (id, transaction) => {
  const role = await roleRepository.findRoleById(id, { transaction });

  if (!role) {
    throw new NotFoundError("Role not found.");
  }

  return role;
};

const getRoleSnapshot = (role) => ({
  id: role.id,
  name: role.name,
  description: role.description,
  isSystem: role.is_system,
  permissionIds: (role.permissions ?? []).map((permission) => permission.id),
});

/**
 * -----------------------------------------------------------------------------
 * Get all roles.
 * -----------------------------------------------------------------------------
 */

const getAllRoles = async () => {
  return roleRepository.findAllRoles();
};

/**
 * -----------------------------------------------------------------------------
 * Get a role by ID.
 * -----------------------------------------------------------------------------
 */

const getRoleById = async (id) => {
  const role = await roleRepository.findRoleById(id);

  if (!role) {
    throw new NotFoundError("Role not found.");
  }

  return role;
};

/**
 * -----------------------------------------------------------------------------
 * Get system-defined permissions.
 * -----------------------------------------------------------------------------
 */

const getPermissions = async () => {
  return Permission.findAll({
    attributes: ["id", "name", "description"],
    order: [["name", "ASC"]],
  });
};

/**
 * -----------------------------------------------------------------------------
 * Create a custom role and assign permissions.
 * -----------------------------------------------------------------------------
 */

const createRole = async ({
  name,
  description,
  permissionIds,
  actorId,
  auditContext,
}) => {
  return sequelize.transaction(async (transaction) => {
    const existingRole = await roleRepository.findRoleByName(
      name,
      undefined,
      transaction,
    );

    if (existingRole) {
      throw new ConflictError("A role with this name already exists.");
    }

    await assertPermissionsExist(permissionIds, transaction);

    const role = await roleRepository.createRole(
      {
        name,
        description: description ?? null,
      },
      transaction,
    );

    await roleRepository.replaceRolePermissions(
      role.id,
      permissionIds,
      transaction,
    );

    const createdRole = await roleRepository.findRoleById(role.id, {
      transaction,
    });

    if (!createdRole) {
      throw new ConflictError("Created role could not be retrieved.");
    }

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.ROLE_CREATED,
      entityType: AUDIT_ENTITY_TYPES.ROLE,
      entityId: createdRole.id,
      previousData: null,
      newData: getRoleSnapshot(createdRole),
      metadata: {
        actorId,
      },
      options: {
        transaction,
      },
    });

    return createdRole;
  });
};

/**
 * -----------------------------------------------------------------------------
 * Update custom role details.
 * -----------------------------------------------------------------------------
 */

const updateRole = async ({
  roleId,
  name,
  description,
  actorId,
  auditContext,
}) => {
  return sequelize.transaction(async (transaction) => {
    const role = await Role.findByPk(roleId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!role) {
      throw new NotFoundError("Role not found.");
    }

    assertCustomRole(role);

    const existingRole = await roleRepository.findRoleByName(
      name,
      roleId,
      transaction,
    );

    if (existingRole) {
      throw new ConflictError("A role with this name already exists.");
    }

    const before = getRoleSnapshot(
      await roleRepository.findRoleById(roleId, { transaction }),
    );

    await roleRepository.updateRole(
      role,
      {
        name,
        description: description ?? null,
      },
      transaction,
    );

    const updatedRole = await roleRepository.findRoleById(roleId, {
      transaction,
    });

    if (!updatedRole) {
      throw new ConflictError("Updated role could not be retrieved.");
    }

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.ROLE_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.ROLE,
      entityId: updatedRole.id,
      previousData: before,
      newData: getRoleSnapshot(updatedRole),
      metadata: {
        actorId,
      },
      options: {
        transaction,
      },
    });

    return updatedRole;
  });
};

/**
 * -----------------------------------------------------------------------------
 * Replace permissions assigned to a custom role.
 * -----------------------------------------------------------------------------
 */

const updateRolePermissions = async ({
  roleId,
  permissionIds,
  actorId,
  auditContext,
}) => {
  return sequelize.transaction(async (transaction) => {
    const role = await Role.findByPk(roleId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!role) {
      throw new NotFoundError("Role not found.");
    }

    assertCustomRole(role);

    await assertPermissionsExist(permissionIds, transaction);

    const currentRole = await roleRepository.findRoleById(roleId, {
      transaction,
    });

    const previousPermissionIds = (currentRole?.permissions ?? []).map(
      (permission) => permission.id,
    );

    if (
      previousPermissionIds.length === permissionIds.length &&
      previousPermissionIds.every((id) => permissionIds.includes(id))
    ) {
      throw new ConflictError("Role already has the selected permissions.");
    }

    await roleRepository.replaceRolePermissions(
      roleId,
      permissionIds,
      transaction,
    );

    const updatedRole = await roleRepository.findRoleById(roleId, {
      transaction,
    });

    if (!updatedRole) {
      throw new ConflictError(
        "Updated role permissions could not be retrieved.",
      );
    }

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.ROLE_PERMISSIONS_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.ROLE,
      entityId: roleId,
      previousData: {
        permissionIds: previousPermissionIds,
      },
      newData: {
        permissionIds,
      },
      metadata: {
        actorId,
      },
      options: {
        transaction,
      },
    });

    return updatedRole;
  });
};

/**
 * -----------------------------------------------------------------------------
 * Delete an unused custom role.
 * -----------------------------------------------------------------------------
 */

const deleteRole = async ({ roleId, actorId, auditContext }) => {
  return sequelize.transaction(async (transaction) => {
    const role = await Role.findByPk(roleId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!role) {
      throw new NotFoundError("Role not found.");
    }

    assertCustomRole(role);

    const assignedUsers = await User.count({
      where: {
        role_id: roleId,
      },
      transaction,
    });

    if (assignedUsers > 0) {
      throw new ConflictError(
        "This role is assigned to users. Reassign those users before deleting it.",
      );
    }

    const previousData = getRoleSnapshot(
      await roleRepository.findRoleById(roleId, { transaction }),
    );
    
    await roleRepository.deleteRole(role, transaction);

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.ROLE_DELETED,
      entityType: AUDIT_ENTITY_TYPES.ROLE,
      entityId: roleId,
      previousData,
      newData: null,
      metadata: {
        actorId,
      },
      options: {
        transaction,
      },
    });

    return {
      id: roleId,
    };
  });
};

export const roleService = {
  getAllRoles,
  getRoleById,
  getPermissions,
  createRole,
  updateRole,
  updateRolePermissions,
  deleteRole,
  getRoleOrThrow,
};
