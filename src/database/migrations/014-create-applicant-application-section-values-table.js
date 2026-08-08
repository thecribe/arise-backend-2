import { DataTypes } from "sequelize";

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable("applicant_application_section_values", {
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

  await queryInterface.addConstraint(
    "applicant_application_section_values",
    {
      fields: ["application_id", "section_id"],
      type: "unique",
      name: "uq_application_section_values",
    },
  );
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable(
    "applicant_application_section_values",
  );
};