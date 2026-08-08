import { DataTypes } from "sequelize";

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable("applicant_application_phases", {
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

    phase_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "locked",
        "draft",
        "in_progress",
        "submitted",
        "rejected",
        "approved",
      ),
      allowNull: false,
      defaultValue: "locked",
    },

    started_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    completed_at: {
      type: DataTypes.DATE,
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

  // Prevent duplicate phase records for the same application.
  await queryInterface.addConstraint("applicant_application_phases", {
    fields: ["application_id", "phase_id"],
    type: "unique",
    name: "uq_application_phase",
  });
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("applicant_application_phases");
};