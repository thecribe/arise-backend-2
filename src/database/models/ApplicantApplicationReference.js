import { DataTypes, Model } from "sequelize";
import { v4 as uuid } from "uuid";

import { sequelize } from "../../config/database.js";

class ApplicantApplicationReference extends Model {}

ApplicantApplicationReference.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
      primaryKey: true,
      allowNull: false,
    },

    applicationId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "application_id",
    },

    companyName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "company_name",
    },

    fromDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "from_date",
    },

    toDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "to_date",
    },

    refereeName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "referee_name",
    },

    refereeEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "referee_email",
    },

    refereePhone: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "referee_phone",
    },

    refereeRelationship: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "referee_relationship",
    },

    status: {
      type: DataTypes.ENUM("in_progress", "submitted", "rejected", "approved"),
      allowNull: false,
      defaultValue: "in_progress",
    },
  },
  {
    sequelize,
    modelName: "ApplicantApplicationReference",
    tableName: "applicant_application_references",
    underscored: true,
    paranoid: true,
    timestamps: true,
    freezeTableName: true,
  },
);

export default ApplicantApplicationReference;
