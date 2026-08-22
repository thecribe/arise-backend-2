/**
 * -----------------------------------------------------------------------------
 * File: application-section-review-comment.model.js
 *
 * Description:
 * Stores individual Recruitment Manager review comments for an application
 * section.
 *
 * A section can have multiple comments throughout its review lifecycle.
 *
 * Important:
 * This table is NOT an audit log.
 *
 * Review comments describe the manager's assessment of the applicant's
 * application.
 * -----------------------------------------------------------------------------
 */

import { DataTypes, Model } from "sequelize";
import { v4 as uuid } from "uuid";

import { sequelize } from "../../config/database.js";

class ApplicationSectionReviewComment extends Model {}

ApplicationSectionReviewComment.init(
  {
    /**
     * ---------------------------------------------------------------------------
     * Unique identifier.
     * ---------------------------------------------------------------------------
     */
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuid(),
    },

    /**
     * ---------------------------------------------------------------------------
     * Application being reviewed.
     * ---------------------------------------------------------------------------
     */
    application_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    /**
     * ---------------------------------------------------------------------------
     * Application-definition section being reviewed.
     *
     * Section IDs are hardcoded in the application definition.
     * ---------------------------------------------------------------------------
     */
    section_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    /**
     * ---------------------------------------------------------------------------
     * Review comment.
     * ---------------------------------------------------------------------------
     */
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    /**
     * ---------------------------------------------------------------------------
     * Manager/user who created the comment.
     * ---------------------------------------------------------------------------
     */
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "application_section_review_comments",
    modelName: "ApplicationSectionReviewComment",
    underscored: true,
    freezeTableName: true,
    timestamps: true,
  },
);

export { ApplicationSectionReviewComment };
