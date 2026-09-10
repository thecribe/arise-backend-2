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
import { AUDIT_ACTIONS } from "../../common/constants/audit-actions.js";
import { AUDIT_ENTITY_TYPES } from "../../common/constants/audit-entity-types.js";
import { recordAuditAction } from "../audit/record-audit-action.js";

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
  auditContext,
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
     * Determine what changed.
     * -------------------------------------------------------------------------
     */

    const statusChanged = currentStatus !== nextStatus;

    const stageChanged = currentStage !== nextStage;

    /**
     * -------------------------------------------------------------------------
     * Update application status history.
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

      history =
        await applicationStatusRepository.findApplicationStatusHistoryById(
          latestStatus.id,
          {
            transaction,
          },
        );

      if (!history) {
        throw new ConflictError(
          "Updated application status history could not be retrieved.",
        );
      }
    } else {
      /**
       * -----------------------------------------------------------------------
       * Fallback for applications without an existing status history.
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
     * Record status audit.
     * -------------------------------------------------------------------------
     */

    if (statusChanged) {
      await recordAuditAction({
        auditContext,
        action: AUDIT_ACTIONS.APPLICATION_STATUS_UPDATED,
        entityType: AUDIT_ENTITY_TYPES.APPLICATION_STATUS,
        entityId: history.id,
        applicationId: application.id,
        previousData: {
          status: currentStatus,
        },
        newData: {
          status: nextStatus,
        },
        metadata: {
          applicantId,
          changedBy,
          reason: reason ?? null,
        },
        options: {
          transaction,
        },
      });
    }

    /**
     * -------------------------------------------------------------------------
     * Record stage audit.
     * -------------------------------------------------------------------------
     */

    if (stageChanged) {
      await recordAuditAction({
        auditContext,
        action: AUDIT_ACTIONS.APPLICATION_STAGE_UPDATED,
        entityType: AUDIT_ENTITY_TYPES.APPLICATION_STATUS,
        entityId: history.id,
        applicationId: application.id,
        previousData: {
          stage: currentStage,
        },
        newData: {
          stage: nextStage,
        },
        metadata: {
          applicantId,
          changedBy,
          reason: reason ?? null,
        },
        options: {
          transaction,
        },
      });
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

      createdAt: history.created_at ? history.created_at.toISOString() : null,

      updatedAt: history.updated_at ? history.updated_at.toISOString() : null,
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
