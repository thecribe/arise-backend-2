import { DataTypes, Model } from "sequelize";

import { v4 as uuid } from "uuid";

import { sequelize } from "../../config/database.js";

class AuditLog extends Model {}

AuditLog.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuid(),
    },

    /**
     * User who performed the action.
     *
     * Nullable because some future actions may be system-generated.
     */
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    /**
     * Machine-readable action.
     *
     * Example:
     * APPLICATION_SECTION_SUBMITTED
     */
    action: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    /**
     * Type of entity affected.
     *
     * Example:
     * applicant_application
     * application_section
     * staff
     * compliance
     */
    entity_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    /**
     * Generic entity identifier.
     *
     * STRING instead of UUID because some audited entities may use
     * non-UUID identifiers.
     */
    entity_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    /**
     * Optional parent applicant application.
     */
    application_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    /**
     * Serialized JSON fields.
     *
     * Serialization and parsing will be handled centrally by the
     * audit service/repository infrastructure.
     */
    previous_data: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    new_data: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    metadata: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },

    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,

    modelName: "AuditLog",

    tableName: "audit_logs",

    underscored: true,

    timestamps: true,

    freezeTableName: true,
  },
);

export { AuditLog };
