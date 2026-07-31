import { DataTypes, Model } from "sequelize";
import { v4 as uuid } from "uuid";

import { sequelize } from "../../config/database.js";

class Token extends Model {}

Token.init(
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

    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    token_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    used_at: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Token",
    tableName: "tokens",
    underscored: true,
    timestamps: true,
    freezeTableName: true,
  },
);

export { Token };
