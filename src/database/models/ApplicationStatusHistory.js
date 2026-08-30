/**
 * -----------------------------------------------------------------------------
 * File: application-status-history.model.js
 *
 * Description:
 *
 * Stores the history of application status and stage transitions.
 *
 * Every application status/stage transition creates a new immutable record.
 *
 * The latest record represents the current application state.
 * -----------------------------------------------------------------------------
 */

import { DataTypes, Model } from "sequelize";
import { v4 as uuid } from "uuid";

import { sequelize } from "../../config/database.js";

class ApplicationStatusHistory extends Model {}

ApplicationStatusHistory.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuid(),
    },

    /**
     * Application whose state changed.
     */

    application_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    /**
     * -------------------------------------------------------------------------
     * Status transition.
     * -------------------------------------------------------------------------
     */

    previous_status: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },

    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },

    /**
     * -------------------------------------------------------------------------
     * Stage transition.
     * -------------------------------------------------------------------------
     */

    previous_stage: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },

    stage: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },

    /**
     * Optional explanation for the transition.
     */

    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    /**
     * User responsible for the change.
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
