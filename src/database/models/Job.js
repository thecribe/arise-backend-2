import { DataTypes, Model } from "sequelize";
import { v4 as uuid } from "uuid";

import { sequelize } from "../../config/database.js";

class Job extends Model {}

Job.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuid(),
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    payload: {
      type: DataTypes.TEXT("long"),
      allowNull: false,

      get() {
        const value = this.getDataValue("payload");
        return value ? JSON.parse(value) : null;
      },

      set(value) {
        this.setDataValue("payload", JSON.stringify(value));
      },
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    max_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
    },

    priority: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    scheduled_at: DataTypes.DATE,

    started_at: DataTypes.DATE,

    completed_at: DataTypes.DATE,

    last_error: DataTypes.TEXT("long"),
  },
  {
    sequelize,
    tableName: "jobs",
    modelName: "Job",
    underscored: true,
    freezeTableName: true,
    timestamps: true,
  },
);

export { Job };
