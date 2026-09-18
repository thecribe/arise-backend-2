import { DataTypes, Model } from "sequelize";

import { v4 as uuid } from "uuid";

import { sequelize } from "../../config/database.js";

class ApplicantApplicationTrainingCertificate extends Model {}

ApplicantApplicationTrainingCertificate.init(
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

    requirement_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    certificate_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    certificate_number: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    issue_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    document: {
      type: DataTypes.TEXT("long"),
      allowNull: true,

      get() {
        const value = this.getDataValue("document");

        if (!value) {
          return null;
        }

        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      },

      set(value) {
        this.setDataValue("document", value ? JSON.stringify(value) : null);
      },
    },

    uploaded_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "ApplicantApplicationTrainingCertificate",
    tableName: "applicant_application_training_certificates",
    underscored: true,
    timestamps: true,
    freezeTableName: true,
    paranoid: true,
    deletedAt: "deleted_at",
  },
);

export { ApplicantApplicationTrainingCertificate };
