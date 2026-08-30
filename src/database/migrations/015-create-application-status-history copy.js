import { DataTypes } from "sequelize";

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable("application_status_history", {
    /**
     * -------------------------------------------------------------------------
     * Unique identifier.
     * -------------------------------------------------------------------------
     */

    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },

    /**
     * -------------------------------------------------------------------------
     * Application whose status/stage changed.
     * -------------------------------------------------------------------------
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
     * -------------------------------------------------------------------------
     * Previous application status.
     *
     * Null when this is the first status history record.
     * -------------------------------------------------------------------------
     */

    previous_status: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },

    /**
     * -------------------------------------------------------------------------
     * Current application status.
     * -------------------------------------------------------------------------
     */

    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },

    /**
     * -------------------------------------------------------------------------
     * Previous application stage.
     *
     * Null when this is the first application history record.
     * -------------------------------------------------------------------------
     */

    previous_stage: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },

    /**
     * -------------------------------------------------------------------------
     * Current application stage.
     *
     * Examples:
     *
     * - APPLICATION_FORM
     * - INTERVIEW
     * - COMPLIANCE
     * -------------------------------------------------------------------------
     */

    stage: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },

    /**
     * -------------------------------------------------------------------------
     * Optional reason for the transition.
     *
     * Useful when:
     *
     * - rejecting an application
     * - moving an applicant backwards
     * - adding an explanation to a decision
     * -------------------------------------------------------------------------
     */

    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    /**
     * -------------------------------------------------------------------------
     * User responsible for the change.
     * -------------------------------------------------------------------------
     */

    changed_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    /**
     * -------------------------------------------------------------------------
     * Timestamps.
     * -------------------------------------------------------------------------
     */

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
   * Retrieve history for an application.
   * ---------------------------------------------------------------------------
   */

  await queryInterface.addIndex(
    "application_status_history",
    ["application_id"],
    {
      name: "idx_application_status_history_application_id",
    },
  );

  /**
   * ---------------------------------------------------------------------------
   * Filter applications by status.
   * ---------------------------------------------------------------------------
   */

  await queryInterface.addIndex("application_status_history", ["status"], {
    name: "idx_application_status_history_status",
  });

  /**
   * ---------------------------------------------------------------------------
   * Filter applications by stage.
   * ---------------------------------------------------------------------------
   */

  await queryInterface.addIndex("application_status_history", ["stage"], {
    name: "idx_application_status_history_stage",
  });

  /**
   * ---------------------------------------------------------------------------
   * Quickly determine the latest application state.
   *
   * The latest record for an application represents its current:
   *
   * - status
   * - stage
   * ---------------------------------------------------------------------------
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
