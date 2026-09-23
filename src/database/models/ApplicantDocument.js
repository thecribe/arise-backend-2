import { DataTypes, Model } from "sequelize";

import { v4 as uuid } from "uuid";

import { sequelize } from "../../config/database.js";

class ApplicantDocument extends Model {}

ApplicantDocument.init(
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

    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    document_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    mime_type: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    size: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "ApplicantDocument",
    tableName: "applicant_documents",
    underscored: true,
    timestamps: true,
    freezeTableName: true,
  },
);

export { ApplicantDocument };
