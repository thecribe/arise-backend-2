import { Op } from "sequelize";
import { Permission } from "../../../database/models/Permission.js";
import { Role } from "../../../database/models/Role.js";
import { RolePermission } from "../../../database/models/RolePermission.js";

const permissionInclude = {
  model: Permission,
  as: "permissions",
  through: {
    attributes: [],
  },
};

const findAllRoles = async () => {
  return Role.findAll({
    include: [permissionInclude],
    order: [["name", "ASC"]],
  });
};

const findRoleById = async (roleId, options = {}) => {
  return Role.findByPk(roleId, {
    ...options,
    include: [permissionInclude],
  });
};

const findRoleByName = async (name, excludeId, transaction) => {
  return Role.findOne({
    where: {
      name,
      ...(excludeId ? { id: { [Op.ne]: excludeId } } : {}),
    },
    transaction,
  });
};

const findPermissionsByIds = async (permissionIds, transaction) => {
  return Permission.findAll({
    where: {
      id: {
        [Op.in]: permissionIds,
      },
    },
    transaction,
  });
};

const createRole = async (values, transaction) => {
  return Role.create(
    {
      ...values,
      is_system: false,
    },
    { transaction },
  );
};

const replaceRolePermissions = async (roleId, permissionIds, transaction) => {
  await RolePermission.destroy({
    where: {
      role_id: roleId,
    },
    transaction,
  });

  if (permissionIds.length === 0) {
    return [];
  }

  return RolePermission.bulkCreate(
    permissionIds.map((permissionId) => ({
      role_id: roleId,
      permission_id: permissionId,
    })),
    { transaction },
  );
};

const updateRole = async (role, values, transaction) => {
  return role.update(values, { transaction });
};

const deleteRole = async (role, transaction) => {
  return role.destroy({ transaction });
};

export const roleRepository = {
  findAllRoles,
  findRoleById,
  findRoleByName,
  findPermissionsByIds,
  createRole,
  replaceRolePermissions,
  updateRole,
  deleteRole,
};
