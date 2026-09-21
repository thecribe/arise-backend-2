import { DataTypes, Model } from "sequelize";
import { v4 as uuid } from "uuid";

import { sequelize } from "../../config/database.js";

class ApplicantInterview extends Model {}

ApplicantInterview.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuid(),
    },

    application_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },

    interviewer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    interview_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    scores: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    raw_score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
    },

    normalized_score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    interviewer_signature: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "ApplicantInterview",
    tableName: "applicant_interviews",
    underscored: true,
    timestamps: true,
    freezeTableName: true,
  },
);

export { ApplicantInterview };
