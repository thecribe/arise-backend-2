import { DataTypes, Model } from "sequelize";
import { v4 as uuid } from "uuid";

import { sequelize } from "../../config/database.js";

class ApplicantInterviewNote extends Model {}

ApplicantInterviewNote.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: () => uuid(),
    },

    interview_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Note content cannot be empty.",
        },
      },
    },

    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ApplicantInterviewNote",
    tableName: "applicant_interview_notes",
    underscored: true,
    timestamps: true,
    freezeTableName: true,
  },
);

export { ApplicantInterviewNote };
