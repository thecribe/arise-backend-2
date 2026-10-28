import { DataTypes, Model } from "sequelize";

import { v4 as uuid } from "uuid";

import { sequelize } from "../../config/database.js";

class ApplicantDeclaration extends Model {}

ApplicantDeclaration.init(
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
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
    },
  },
  {
    sequelize,
    modelName: "ApplicantDeclaration",
    tableName: "applicant_declarations",
    underscored: true,
    timestamps: true,
    freezeTableName: true,
  },
);

export { ApplicantDeclaration };
