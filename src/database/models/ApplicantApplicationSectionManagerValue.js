import { DataTypes, Model } from "sequelize";
import { v4 as uuid } from "uuid";
import { sequelize } from "../../config/database.js";

class ApplicantApplicationSectionManagerValue extends Model {}

ApplicantApplicationSectionManagerValue.init(
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

    values: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "ApplicantApplicationSectionManagerValue",
    tableName: "applicant_application_section_manager_values",
    underscored: true,
    timestamps: true,
    freezeTableName: true,
    paranoid: true,
    deletedAt: "deleted_at",
  },
);

export { ApplicantApplicationSectionManagerValue };
