import { DataTypes, Model } from "sequelize";
import { v4 as uuid } from "uuid";

import { sequelize } from "../../config/database.js";

class UserRole extends Model {}

UserRole.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuid(),
    },

    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    role_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    assigned_at: DataTypes.DATE,

    assigned_by: DataTypes.UUID,
  },
  {
    sequelize,
    modelName: "UserRole",
    tableName: "user_roles",
    underscored: true,
    timestamps: true,
    freezeTableName: true,
  },
);

export { UserRole };
