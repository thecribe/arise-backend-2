/**
 * -----------------------------------------------------------------------------
 * File: application-status.repository.js
 *
 * Description:
 *
 * Handles database operations for applicant application status history.
 * -----------------------------------------------------------------------------
 */

import { ApplicationStatusHistory } from "../../database/models/ApplicationStatusHistory.js";
import { User } from "../../database/models/User.js";

/**
 * -----------------------------------------------------------------------------
 * Get the latest status record for an application.
 * -----------------------------------------------------------------------------
 */

const findLatestApplicationStatus = async (applicationId, options = {}) => {
  return ApplicationStatusHistory.findOne({
    where: {
      application_id: applicationId,
    },

    include: [
      {
        model: User,
        as: "changedByUser",

        attributes: ["id", "first_name", "last_name", "email"],

        required: false,
      },
    ],

    order: [["created_at", "DESC"]],

    ...options,
  });
};

/**
 * -----------------------------------------------------------------------------
 * Create a new application status history record.
 * -----------------------------------------------------------------------------
 */

const createApplicationStatusHistory = async (data, options = {}) => {
  return ApplicationStatusHistory.create(data, options);
};

const updateApplicationStatusHistory = async (
  {
    historyId,
    previousStatus,
    status,
    previousStage,
    stage,
    reason,
    changedBy,
  },
  { transaction },
) => {
  const [updated] = await ApplicationStatusHistory.update(
    {
      previous_status: previousStatus,
      status,

      previous_stage: previousStage,
      stage,

      reason,

      changed_by: changedBy,
    },
    {
      where: {
        id: historyId,
      },
      transaction,
    },
  );

  return updated;
};

const findApplicationStatusHistoryById = async (
  historyId,
  { transaction } = {},
) => {
  return ApplicationStatusHistory.findByPk(historyId, {
    transaction,
  });
};

export const applicationStatusRepository = {
  findLatestApplicationStatus,

  createApplicationStatusHistory,
  findApplicationStatusHistoryById,
  updateApplicationStatusHistory,
};
