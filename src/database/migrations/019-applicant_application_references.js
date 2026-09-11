import { DataTypes } from "sequelize";

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable("applicant_application_references", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
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

    company_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    from_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    to_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    referee_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    referee_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    referee_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    referee_relationship: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("in_progress", "submitted", "rejected", "approved"),
      allowNull: false,
      defaultValue: "in_progress",
    },

    deleted_at: {
      type: DataTypes.DATE,
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
  await queryInterface.dropTable("applicant_application_references");
};
