import { DataTypes } from "sequelize";

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable("application_section_review_comments", {
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

    comment: {
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

  /**
   * ---------------------------------------------------------------------------
   * Index used when retrieving comments for a selected application section.
   * ---------------------------------------------------------------------------
   */
  await queryInterface.addIndex(
    "application_section_review_comments",
    ["application_id", "section_id"],
    {
      name: "idx_application_section_review_comments",
    },
  );
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("application_section_review_comments");
};
