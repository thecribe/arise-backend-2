/**
 * -----------------------------------------------------------------------------
 * File: application-status-history.model.js
 *
 * Description:
 * Stores the status history of an applicant application.
 *
 * Every status transition creates a new record. The current application
 * status is therefore determined by the latest status history record.
 * -----------------------------------------------------------------------------
 */

import { DataTypes, Model } from "sequelize";
import { v4 as uuid } from "uuid";

import { sequelize } from "../../config/database.js";

class ApplicationStatusHistory extends Model {}

ApplicationStatusHistory.init(
  {
    /**
     * Unique identifier.
     */
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuid(),
    },

    /**
     * Application whose status changed.
     */
    application_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    /**
     * Status before the transition.
     *
     * This is null for the first status record.
     */
    previous_status: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },

    /**
     * Status assigned to the application.
     */
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },

    /**
     * Optional explanation for the status change.
     *
     * This is particularly useful for rejection decisions.
     */
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    /**
     * User responsible for making the status change.
     */
    changed_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "application_status_history",
    modelName: "ApplicationStatusHistory",
    underscored: true,
    freezeTableName: true,
    timestamps: true,
  },
);

export { ApplicationStatusHistory };
