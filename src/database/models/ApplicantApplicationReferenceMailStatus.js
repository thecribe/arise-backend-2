import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.js";

class ApplicantApplicationReferenceMailStatus extends Model {}

ApplicantApplicationReferenceMailStatus.init(
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

    status: {
      type: DataTypes.ENUM("Not sent", "Pending", "Received", "Refused"),
      allowNull: false,
      defaultValue: "Not sent",
    },
  },
  {
    sequelize,
    modelName: "ApplicantApplicationReferenceMailStatus",
    tableName: "applicant_application_reference_mail_statuses",
    underscored: true,
    paranoid: true,
    timestamps: true,
    freezeTableName: true,
  },
);

export default ApplicantApplicationReferenceMailStatus;
