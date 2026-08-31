import { DataTypes } from "sequelize";

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable("audit_logs", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },

    /**
     * ----------------------------------------------------------------------
     * Who performed the action.
     *
     * Nullable to support future system-generated audit events.
     * ----------------------------------------------------------------------
     */

    user_id: {
      type: DataTypes.UUID,
      allowNull: true,

      references: {
        model: "users",
        key: "id",
      },

      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },

    /**
     * ----------------------------------------------------------------------
     * What happened.
     *
     * Examples:
     *
     * APPLICATION_SECTION_SUBMITTED
     * APPLICATION_SECTION_UPDATED
     * APPLICATION_SECTION_APPROVED
     * APPLICATION_SECTION_REJECTED
     * APPLICATION_STATUS_UPDATED
     * ----------------------------------------------------------------------
     */

    action: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    /**
     * ----------------------------------------------------------------------
     * What type of entity was affected.
     *
     * Examples:
     *
     * applicant_application
     * application_section
     * application_phase
     * staff
     * compliance
     * ----------------------------------------------------------------------
     */

    entity_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    /**
     * ----------------------------------------------------------------------
     * ID of the affected entity.
     *
     * This is intentionally not a foreign key because audit logs are
     * polymorphic and can reference different tables/entities.
     * ----------------------------------------------------------------------
     */

    entity_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    /**
     * ----------------------------------------------------------------------
     * Optional parent applicant application.
     *
     * Allows all audit events related to an applicant's recruitment journey
     * to be queried efficiently.
     * ----------------------------------------------------------------------
     */

    application_id: {
      type: DataTypes.UUID,
      allowNull: true,

      references: {
        model: "applicant_applications",
        key: "id",
      },

      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },

    /**
     * ----------------------------------------------------------------------
     * Previous entity state.
     *
     * Stored as serialized JSON text for MySQL compatibility.
     * ----------------------------------------------------------------------
     */

    previous_data: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    /**
     * ----------------------------------------------------------------------
     * New entity state.
     *
     * Stored as serialized JSON text for MySQL compatibility.
     * ----------------------------------------------------------------------
     */

    new_data: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    /**
     * ----------------------------------------------------------------------
     * Additional context.
     *
     * Stored as serialized JSON text.
     * ----------------------------------------------------------------------
     */

    metadata: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    /**
     * ----------------------------------------------------------------------
     * Client IP address.
     *
     * VARCHAR(45) supports both IPv4 and IPv6 addresses.
     * ----------------------------------------------------------------------
     */

    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },

    /**
     * ----------------------------------------------------------------------
     * Browser/client information.
     * ----------------------------------------------------------------------
     */

    user_agent: {
      type: DataTypes.TEXT,
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

  /**
   * ------------------------------------------------------------------------
   * Indexes
   *
   * These support the most likely audit queries.
   * ------------------------------------------------------------------------
   */

  await queryInterface.addIndex("audit_logs", ["user_id"]);

  await queryInterface.addIndex("audit_logs", ["application_id"]);

  await queryInterface.addIndex("audit_logs", ["entity_type", "entity_id"]);

  await queryInterface.addIndex("audit_logs", ["action"]);

  await queryInterface.addIndex("audit_logs", ["created_at"]);
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("audit_logs");
};
