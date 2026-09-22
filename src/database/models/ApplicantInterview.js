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

    interviewer_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Interviewer name is required.",
        },
        len: {
          args: [2, 255],
          msg: "Interviewer name must be between 2 and 255 characters.",
        },
      },
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
