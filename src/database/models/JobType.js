import { DataTypes, Model } from "sequelize";
import { v4 as uuid } from "uuid";

import { sequelize } from "../../config/database.js";

class JobType extends Model {}

JobType.init(
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

    is_default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,

    modelName: "JobType",

    tableName: "job_types",

    freezeTableName: true,

    underscored: true,

    timestamps: true,

    paranoid: true,

    deletedAt: "deleted_at",
  },
);

export { JobType };
