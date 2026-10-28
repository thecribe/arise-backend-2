import { DataTypes } from "sequelize";

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable("general_settings", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
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
    },

    recruitment_email: {
      type: DataTypes.STRING(255),
      allowNull: true,
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

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  await queryInterface.addIndex("general_settings", ["organisation_name"], {
    name: "general_settings_organisation_name_index",
  });
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("general_settings");
};
