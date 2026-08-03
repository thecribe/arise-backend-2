import { DataTypes } from "sequelize";
import { PERMISSIONS } from "../../common/constants/permissions.js";

const ROLE_PERMISSION_MAP = {
  APPLICANT: [
    PERMISSIONS.APPLICATION_VIEW.name,
    PERMISSIONS.APPLICATION_CREATE.name,
    PERMISSIONS.APPLICATION_UPDATE.name,
    PERMISSIONS.APPLICATION_SUBMIT.name,
  ],

  RECRUITMENT_MANAGER: [
    PERMISSIONS.APPLICATION_VIEW.name,

    PERMISSIONS.RECRUITMENT_VIEW.name,
    PERMISSIONS.RECRUITMENT_COMMENT.name,
    PERMISSIONS.RECRUITMENT_APPROVE.name,
  ],

  COMPLIANCE_MANAGER: [
    PERMISSIONS.COMPLIANCE_VIEW.name,
    PERMISSIONS.COMPLIANCE_UPLOAD.name,
    PERMISSIONS.COMPLIANCE_UPDATE.name,
  ],

  STAFF_MANAGER: [
    PERMISSIONS.STAFF_VIEW.name,
    PERMISSIONS.STAFF_CREATE.name,
    PERMISSIONS.STAFF_UPDATE.name,
    PERMISSIONS.STAFF_DELETE.name,
  ],

  TOP_ADMIN: "*",
};

const buildRolePermissionRows = (roles, permissions) => {
  const roleMap = new Map(roles.map((role) => [role.name, role]));

  const permissionMap = new Map(
    permissions.map((permission) => [permission.name, permission]),
  );

  const rows = [];

  for (const [roleName, assignedPermissions] of Object.entries(
    ROLE_PERMISSION_MAP,
  )) {
    const role = roleMap.get(roleName);

    if (!role) continue;

    const rolePermissions =
      assignedPermissions === "*"
        ? [...permissionMap.values()]
        : assignedPermissions
            .map((name) => permissionMap.get(name))
            .filter(Boolean);

    for (const permission of rolePermissions) {
      rows.push({
        role_id: role.id,
        permission_id: permission.id,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
  }

  return rows;
};

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable("role_permissions", {
    role_id: {
      type: DataTypes.UUID,
      allowNull: false,

      references: {
        model: "roles",
        key: "id",
      },

      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    permission_id: {
      type: DataTypes.UUID,
      allowNull: false,

      references: {
        model: "permissions",
        key: "id",
      },

      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  await queryInterface.addConstraint("role_permissions", {
    fields: ["role_id", "permission_id"],
    type: "primary key",
    name: "pk_role_permissions",
  });

  const [roles] = await queryInterface.sequelize.query(`
        SELECT id, name
        FROM roles
    `);

  const [permissions] = await queryInterface.sequelize.query(`
            SELECT id, name
            FROM permissions
        `);

  await queryInterface.bulkInsert(
    "role_permissions",
    buildRolePermissionRows(roles, permissions),
  );
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("role_permissions");
};
