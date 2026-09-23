import { DataTypes } from "sequelize";

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable("applicant_documents", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },

    application_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "applicant_applications",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
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
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("applicant_documents");
};
