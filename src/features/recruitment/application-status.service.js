/**
 * -----------------------------------------------------------------------------
 * File: application-status.service.js
 *
 * Description:
 *
 * Handles Recruitment Manager application status and stage transitions.
 * -----------------------------------------------------------------------------
 */

import { sequelize } from "../../config/database.js";

import { recruitmentRepository } from "./recruitment.repository.js";

import { applicationStatusRepository } from "./application-status.repository.js";
import {
  APPLICATION_STAGE,
  APPLICATION_STATUS,
} from "../../application-definition/constants.js";
import { NotFoundError } from "../../common/errors/not-found-error.js";
import { ConflictError } from "../../common/errors/conflict-error.js";

/**
 * -----------------------------------------------------------------------------
 * Update application status and/or stage.
 * -----------------------------------------------------------------------------
 */

const updateApplicationStatus = async ({
  applicantId,
  status,
  stage,
  reason,
  changedBy,
}) => {
  return sequelize.transaction(async (transaction) => {
    /**
     * -------------------------------------------------------------------------
     * Confirm application exists.
     * -------------------------------------------------------------------------
     */

    const application =
      await recruitmentRepository.findApplicantApplicationById(applicantId, {
        transaction,
      });

    if (!application) {
      throw new NotFoundError("Applicant application not found.");
    }

    /**
     * -------------------------------------------------------------------------
     * Get current application state.
     * -------------------------------------------------------------------------
     */

    const latestStatus =
      await applicationStatusRepository.findLatestApplicationStatus(
        application.id,
        {
          transaction,
        },
      );

    /**
     * -------------------------------------------------------------------------
     * Resolve the current state.
     * -------------------------------------------------------------------------
     */

    const currentStatus =
      latestStatus?.status ?? APPLICATION_STATUS.IN_PROGRESS;

    const currentStage =
      latestStatus?.stage ?? APPLICATION_STAGE.APPLICATION_FORM;

    /**
     * -------------------------------------------------------------------------
     * Resolve the new state.
     *
     * This allows the manager to update:
     *
     * - only status
     * - only stage
     * - both status and stage
     * -------------------------------------------------------------------------
     */

    const nextStatus = status ?? currentStatus;

    const nextStage = stage ?? currentStage;

    /**
     * -------------------------------------------------------------------------
     * Prevent unnecessary updates.
     * -------------------------------------------------------------------------
     */

    if (currentStatus === nextStatus && currentStage === nextStage) {
      throw new ConflictError(
        "Application already has the selected status and stage.",
      );
    }

    /**
     * -------------------------------------------------------------------------
     * Update existing application status history.
     *
     * The existing record represents the current application state.
     * -------------------------------------------------------------------------
     */

    let history;

    if (latestStatus) {
      await applicationStatusRepository.updateApplicationStatusHistory(
        {
          historyId: latestStatus.id,

          previousStatus: currentStatus,
          status: nextStatus,

          previousStage: currentStage,
          stage: nextStage,

          reason: reason ?? latestStatus.reason ?? null,

          changedBy,
        },
        {
          transaction,
        },
      );

      /**
       * -----------------------------------------------------------------------
       * Fetch the updated record.
       *
       * This ensures the response contains the latest timestamps and values.
       * -----------------------------------------------------------------------
       */

      history =
        await applicationStatusRepository.findApplicationStatusHistoryById(
          latestStatus.id,
          {
            transaction,
          },
        );
    } else {
      /**
       * -----------------------------------------------------------------------
       * Fallback for applications without a status history record.
       *
       * Normally initialization should already have created this record.
       * -----------------------------------------------------------------------
       */

      history =
        await applicationStatusRepository.createApplicationStatusHistory(
          {
            application_id: application.id,

            previous_status: null,
            status: nextStatus,

            previous_stage: null,
            stage: nextStage,

            reason: reason ?? null,

            changed_by: changedBy,
          },
          {
            transaction,
          },
        );
    }

    /**
     * -------------------------------------------------------------------------
     * Return clean API contract.
     * -------------------------------------------------------------------------
     */

    return {
      id: history.id,

      previousStatus: history.previous_status,
      status: history.status,

      previousStage: history.previous_stage,
      stage: history.stage,

      reason: history.reason,

      changedBy: history.changed_by,

      createdAt: history.created_at,
      updatedAt: history.updated_at,
    };
  });
};

const getApplicationStatus = async (applicantId) => {
  /**
   * ---------------------------------------------------------------------------
   * Confirm application exists.
   * ---------------------------------------------------------------------------
   */

  const application =
    await recruitmentRepository.findApplicantApplicationById(applicantId);

  if (!application) {
    throw new NotFoundError("Applicant application not found.");
  }

  /**
   * ---------------------------------------------------------------------------
   * Get latest status.
   * ---------------------------------------------------------------------------
   */

  const latestStatus =
    await applicationStatusRepository.findLatestApplicationStatus(
      application.id,
    );

  if (!latestStatus) {
    return null;
  }

  /**
   * ---------------------------------------------------------------------------
   * Return clean API contract.
   * ---------------------------------------------------------------------------
   */

  return {
    id: latestStatus.id,

    previousStatus: latestStatus.previous_status,

    status: latestStatus.status,

    previousStage: latestStatus.previous_stage,

    stage: latestStatus.stage,

    reason: latestStatus.reason,

    changedBy: latestStatus.changedByUser
      ? {
          id: latestStatus.changedByUser.id,

          firstName: latestStatus.changedByUser.first_name,

          lastName: latestStatus.changedByUser.last_name,

          email: latestStatus.changedByUser.email,
        }
      : null,

    createdAt: latestStatus.created_at,

    updatedAt: latestStatus.updated_at,
  };
};

export const applicationStatusService = {
  updateApplicationStatus,
  getApplicationStatus,
};
