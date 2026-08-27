import { DataTypes, Model } from "sequelize";
import { v4 as uuid } from "uuid";

import { sequelize } from "../../config/database.js";

class ApplicantApplicationPhase extends Model {}

ApplicantApplicationPhase.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuid(),
    },

    application_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    phase_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("locked", "in_progress", "approved"),
      allowNull: false,
      defaultValue: "locked",
    },

    started_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "ApplicantApplicationPhase",
    tableName: "applicant_application_phases",
    underscored: true,
    timestamps: true,
    freezeTableName: true,
    paranoid: true,
    deletedAt: "deleted_at",
  },
);

export { ApplicantApplicationPhase };
