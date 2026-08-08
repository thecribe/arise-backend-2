import { DataTypes, Model } from "sequelize";
import { v4 as uuid } from "uuid";

import { sequelize } from "../../config/database.js";

class ApplicantApplicationSection extends Model {}

ApplicantApplicationSection.init(
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

    section_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "locked",
        "draft",
        "in_progress",
        "submitted",
        "rejected",
        "approved",
      ),
      allowNull: false,
      defaultValue: "locked",
    },

    recruiter_comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    submitted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    approved_at: {
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
    modelName: "ApplicantApplicationSection",
    tableName: "applicant_application_sections",
    underscored: true,
    timestamps: true,
    freezeTableName: true,
    paranoid: true,
    deletedAt: "deleted_at",
  },
);

export { ApplicantApplicationSection };