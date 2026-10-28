import { DataTypes, Model } from "sequelize";
import { v4 as uuid } from "uuid";

import { sequelize } from "../../config/database.js";

class GeneralSettings extends Model {}

GeneralSettings.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuid(),
    },

    organisation_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "Airse",
    },

    site_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "Airse Recruitment",
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    website_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    organisation_email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },

    recruitment_email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      // validate: {
      //   isEmail: true,
      // },
    },

    telephone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    postcode: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },

    logo: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "JSON-serialised logo file metadata",
    },

    favicon: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "JSON-serialised favicon file metadata",
    },
  },
  {
    sequelize,
    modelName: "GeneralSettings",
    tableName: "general_settings",
    underscored: true,
    timestamps: true,
    freezeTableName: true,
  },
);

export { GeneralSettings };
