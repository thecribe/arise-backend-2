import { DataTypes, Model } from "sequelize";

import { sequelize } from "../../config/database.js";

class RolePermission extends Model {}

RolePermission.init(
  {
    role_id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },

    permission_id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: "RolePermission",
    tableName: "role_permissions",
    underscored: true,
    freezeTableName: true,
    timestamps: true,
  },
);

export { RolePermission };
