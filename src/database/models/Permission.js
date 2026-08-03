import { DataTypes, Model } from "sequelize";
import { v4 as uuid } from "uuid";

import { sequelize } from "../../config/database.js";

class Permission extends Model {}

Permission.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuid(),
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Permission",
    tableName: "permissions",
    underscored: true,
    freezeTableName: true,
    timestamps: true,
  },
);

export { Permission };
