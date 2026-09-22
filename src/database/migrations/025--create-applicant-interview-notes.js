import { DataTypes } from "sequelize";

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable("applicant_interview_notes", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },

    interview_id: {
      type: DataTypes.UUID,
      allowNull: false,

      references: {
        model: "applicant_interviews",
        key: "id",
      },

      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    created_by: {
      type: DataTypes.UUID,
      allowNull: false,

      references: {
        model: "users",
        key: "id",
      },

      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
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

  await queryInterface.addIndex("applicant_interview_notes", ["interview_id"]);
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("applicant_interview_notes");
};
