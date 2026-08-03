import { DataTypes, Model } from "sequelize";
import { v4 as uuid } from "uuid";

import { sequelize } from "../../config/database.js";

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuid(),
    },

    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    phone_number: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    postcode: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    role_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    job_type_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    is_email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    email_verified_at: DataTypes.DATE,

    last_login_at: DataTypes.DATE,

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    underscored: true,
    timestamps: true,
    freezeTableName: true,
    paranoid: true,
    deletedAt: "deleted_at",
  },
);

export { User };
