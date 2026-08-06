import { DataTypes, Model } from "sequelize";
import { v4 as uuid } from "uuid";

import { sequelize } from "../../config/database.js";

class UserSession extends Model {}

UserSession.init(
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

    refresh_token_hash: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    device_name: DataTypes.STRING,

    ip_address: DataTypes.STRING,

    user_agent: DataTypes.TEXT,

    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    revoked_at: DataTypes.DATE,

    last_used_at: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "UserSession",
    tableName: "user_sessions",
    underscored: true,
    timestamps: true,
    freezeTableName: true,
  },
);

export { UserSession };
