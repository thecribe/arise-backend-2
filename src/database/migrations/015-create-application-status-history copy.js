import { DataTypes } from "sequelize";

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable("application_status_history", {
    /**
     * Unique identifier.
     */
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },

    /**
     * Application whose status changed.
     */
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

    /**
     * Status before the transition.
     *
     * Null when this is the application's first status record.
     */
    previous_status: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },

    /**
     * New application status.
     */
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },

    /**
     * Optional reason for the status transition.
     */
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    /**
     * User responsible for the status change.
     *
     * We intentionally don't add a foreign key here yet because
     * the exact user table/relationship should remain consistent
     * with the existing project design.
     */
    changed_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    /**
     * Record creation timestamp.
     */
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    /**
     * Record update timestamp.
     */
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  /**
   * Index application_id because the most common operation will be
   * retrieving the status history for a specific application.
   */
  await queryInterface.addIndex(
    "application_status_history",
    ["application_id"],
    {
      name: "idx_application_status_history_application_id",
    },
  );

  /**
   * Index status because Recruitment will frequently query the
   * latest status when filtering applicants.
   */
  await queryInterface.addIndex("application_status_history", ["status"], {
    name: "idx_application_status_history_status",
  });

  /**
   * Index application_id + created_at because determining the
   * current status requires finding the latest status record
   * for an application.
   */
  await queryInterface.addIndex(
    "application_status_history",
    ["application_id", "created_at"],
    {
      name: "idx_application_status_history_application_created",
    },
  );
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("application_status_history");
};
