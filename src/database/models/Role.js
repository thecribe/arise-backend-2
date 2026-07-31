import { DataTypes, Model } from "sequelize";
import { v4 as uuid } from "uuid";

import { sequelize } from "../../config/database.js";

class Role extends Model {}

Role.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuid(),
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    description: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "Role",
    tableName: "roles",
    underscored: true,
    timestamps: true,
    freezeTableName: true,
  },
);

export { Role };
