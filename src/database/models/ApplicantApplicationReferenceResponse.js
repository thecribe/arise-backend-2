import { DataTypes, Model } from "sequelize";
import { v4 as uuid } from "uuid";

import { sequelize } from "../../config/database.js";

class ApplicantApplicationReferenceResponse extends Model {}

ApplicantApplicationReferenceResponse.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    referenceId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "reference_id",
    },

    reEmploy: {
      type: DataTypes.ENUM("Yes", "No"),
      allowNull: false,
      field: "re_employ",
    },

    ratings: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },

    detailReference: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "detail_reference",
    },

    refererName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "referer_name",
    },

    refererSignature: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      field: "referer_signature",
    },
    signatureDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "signature_date",
    },
  },
  {
    sequelize,
    modelName: "ApplicantApplicationReferenceResponse",
    tableName: "applicant_application_reference_responses",
    underscored: true,
    paranoid: true,
    timestamps: true,
    freezeTableName: true,
  },
);

export default ApplicantApplicationReferenceResponse;
