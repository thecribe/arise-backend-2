import { DataTypes, Model } from "sequelize";
import { v4 as uuid } from "uuid";

import { sequelize } from "../../config/database.js";

class ApplicantApplication extends Model {}

ApplicantApplication.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuid(),
    },

    applicant_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },

    current_phase_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    current_section_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    submitted_at: {
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
    modelName: "ApplicantApplication",
    tableName: "applicant_applications",
    underscored: true,
    timestamps: true,
    freezeTableName: true,
    paranoid: true,
    deletedAt: "deleted_at",
  },
);

export { ApplicantApplication };
