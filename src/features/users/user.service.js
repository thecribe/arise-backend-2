import { AUDIT_ACTIONS } from "../../common/constants/audit-actions.js";
import { AUDIT_ENTITY_TYPES } from "../../common/constants/audit-entity-types.js";
import { JOB_TYPES } from "../../common/constants/job-types.js";
import { TOKEN_TYPES } from "../../common/constants/token-types.js";
import { ConflictError } from "../../common/errors/conflict-error.js";
import { NotFoundError } from "../../common/errors/not-found-error.js";
import { passwordService } from "../../common/services/password.service.js";
import { tokenService } from "../../common/services/token.service.js";
import { sequelize } from "../../config/database.js";
import { jobService } from "../../infrastructure/jobs/job.service.js";
import { recordAuditAction } from "../audit/record-audit-action.js";
import { authRepository } from "../auth/auth.repository.js";
import { authService } from "../auth/auth.service.js";
import { applicationStatusService } from "../recruitment/application-status.service.js";
import * as userRepository from "./user.repository.js";

/**
 * -----------------------------------------------------------------------------
 * User Service
 * -----------------------------------------------------------------------------
 */

/**
 * Get user profile and application state.
 */
const getUserProfile = async (applicantId) => {
  const user = await userRepository.findUserProfileById(applicantId);

  if (!user) {
    throw new NotFoundError("Applicant not found.");
  }

  const application = await userRepository.findApplicantApplicationByIds(
    applicantId,
    // applicationId,
  );

  if (!application) {
    throw new NotFoundError("Applicant application not found.");
  }

  const applicationState =
    await userRepository.findApplicationStateByApplicationId(application.id);

  return {
    user,
    application,
    applicationState,
  };
};

/**
 * Update applicant profile details.
 */
const updateUserProfile = async (applicantId, values, auditContext) => {
  return sequelize.transaction(async (transaction) => {
    const user = await userRepository.findUserById(applicantId, {
      transaction,
    });

    if (!user) {
      throw new NotFoundError("Applicant not found.");
    }

    // Email and password must be updated through their
    // dedicated operations.
    const { email, password, role_id, is_active, ...profileValues } = values;

    if (
      email !== undefined ||
      password !== undefined ||
      role_id !== undefined ||
      is_active !== undefined
    ) {
      throw new ConflictError(
        "Sensitive account fields cannot be updated through the profile endpoint.",
      );
    }

    const previousData = {};

    console.log({ profileValues });
    for (const key of Object.keys(profileValues)) {
      previousData[key] = user.get(key);
    }

    await userRepository.updateUserProfile(applicantId, profileValues, {
      transaction,
    });

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.USER_PROFILE_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.USER,
      entityId: applicantId,
      previousData,
      newData: profileValues,
      metadata: {
        applicantId,
      },
      options: {
        transaction,
      },
    });

    return userRepository.findUserProfileById(applicantId, {
      transaction,
    });
  });
};

/**
 * Update applicant email.
 */
const updateUserEmail = async (applicantId, email, auditContext) => {
  return sequelize.transaction(async (transaction) => {
    const user = await userRepository.findUserById(applicantId, {
      transaction,
    });

    if (!user) {
      throw new NotFoundError("Applicant not found.");
    }

    const existingUser = await userRepository.findUserByEmail(email, {
      transaction,
    });

    if (existingUser && existingUser.id !== applicantId) {
      throw new ConflictError(
        "An account with this email address already exists.",
      );
    }

    const previousEmail = user.email;

    if (previousEmail === email) {
      return userRepository.findUserProfileById(applicantId, {
        transaction,
      });
    }

    await userRepository.updateUserEmail(applicantId, email, { transaction });

    /**
     * ----------------------------------------------------------------------
     * Generate verification token
     * ----------------------------------------------------------------------
     */

    const verificationToken = tokenService.generate();

    const tokenHash = tokenService.hash(verificationToken);

    /**
     * ----------------------------------------------------------------------
     * Save token
     * ----------------------------------------------------------------------
     */

    await authRepository.createToken(
      {
        user_id: user.id,
        type: TOKEN_TYPES.EMAIL_VERIFICATION,
        token_hash: tokenHash,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      transaction,
    );

    await authRepository.revokeAllSessions(user.id, transaction);

    /**
     * ----------------------------------------------------------------------
     * Queue verification email
     * ----------------------------------------------------------------------
     */

    await jobService.dispatch(
      {
        type: JOB_TYPES.EMAIL_VERIFICATION,

        payload: {
          userId: user.id,
          firstName: user.first_name,
          email: email,
          type: "email",
          token: verificationToken,
        },
      },
      transaction,
    );

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.USER_EMAIL_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.USER,
      entityId: applicantId,
      previousData: {
        email: previousEmail,
      },
      newData: {
        email,
      },
      metadata: {
        applicantId,
      },
      options: {
        transaction,
      },
    });

    return userRepository.findUserProfileById(applicantId, {
      transaction,
    });
  });
};

/**
 * Change applicant password.
 *
 * The plain-text password is never included in the audit record.
 */
const updateUserPassword = async (applicantId, password, auditContext) => {
  return sequelize.transaction(async (transaction) => {
    const user = await userRepository.findUserById(applicantId, {
      transaction,
    });

    if (!user) {
      throw new NotFoundError("Applicant not found.");
    }

    const hashedPassword = await passwordService.hash(password);

    await userRepository.updateUserPassword(applicantId, hashedPassword, {
      transaction,
    });

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.USER_PASSWORD_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.USER,
      entityId: applicantId,
      previousData: null,
      newData: {
        passwordChanged: true,
      },
      metadata: {
        applicantId,
      },
      options: {
        transaction,
      },
    });

    return {
      applicantId,
      passwordUpdated: true,
    };
  });
};

/**
 * Update applicant account activation.
 */
const updateUserAccountStatus = async (applicantId, isActive, auditContext) => {
  return sequelize.transaction(async (transaction) => {
    const user = await userRepository.findUserById(applicantId, {
      transaction,
    });

    if (!user) {
      throw new NotFoundError("Applicant not found.");
    }

    const previousStatus = user.is_active;

    if (previousStatus === isActive) {
      return {
        applicantId,
        isActive,
      };
    }

    await userRepository.updateUserAccountStatus(applicantId, isActive, {
      transaction,
    });

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.USER_ACCOUNT_STATUS_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.USER,
      entityId: applicantId,
      previousData: {
        is_active: previousStatus,
      },
      newData: {
        is_active: isActive,
      },
      metadata: {
        applicantId,
      },
      options: {
        transaction,
      },
    });

    return {
      applicantId,
      isActive,
    };
  });
};

/**
 * Update application status and/or stage.
 *
 * The existing status history record is updated rather
 * than creating a new one.
 */
const updateApplicationState = async (
  applicantId,
  applicationId,
  values,
  auditContext,
) => {
  return sequelize.transaction(async (transaction) => {
    // -----------------------------------------------------------------------
    // Find applicant
    // -----------------------------------------------------------------------

    const user = await userRepository.findUserById(applicantId, {
      transaction,
    });

    if (!user) {
      throw new NotFoundError("Applicant not found.");
    }

    // -----------------------------------------------------------------------
    // Find applicant application and verify ownership
    // -----------------------------------------------------------------------

    const application = await userRepository.findApplicantApplicationByIds(
      applicantId,
      applicationId,
      { transaction },
    );

    if (!application) {
      throw new NotFoundError("Applicant application not found.");
    }

    // -----------------------------------------------------------------------
    // Find existing application state
    // -----------------------------------------------------------------------

    const currentState =
      await userRepository.findApplicationStateByApplicationId(applicationId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

    if (!currentState) {
      throw new NotFoundError("Application status history record not found.");
    }

    // -----------------------------------------------------------------------
    // Validate fields
    // -----------------------------------------------------------------------

    const allowedStatuses = ["in_progress", "approved", "rejected"];

    const allowedStages = ["application-form", "interview", "compliance"];

    const { status, stage, reason } = values;

    if (status !== undefined && !allowedStatuses.includes(status)) {
      throw new ConflictError("Invalid application status.");
    }

    if (stage !== undefined && !allowedStages.includes(stage)) {
      throw new ConflictError("Invalid application stage.");
    }

    if (status === undefined && stage === undefined) {
      throw new ConflictError(
        "At least one application state field must be provided.",
      );
    }

    // -----------------------------------------------------------------------
    // Capture previous and new state
    // -----------------------------------------------------------------------

    const previousData = {
      status: currentState.status,
      stage: currentState.stage,
      reason: currentState.reason,
    };

    const newStatus = status ?? currentState.status;
    const newStage = stage ?? currentState.stage;

    if (newStatus === currentState.status && newStage === currentState.stage) {
      return {
        applicantId,
        applicationId,
        status: currentState.status,
        stage: currentState.stage,
      };
    }

    // -----------------------------------------------------------------------
    // Update existing state
    // -----------------------------------------------------------------------

    const updateValues = {
      previous_status: currentState.status,
      status: newStatus,
      previous_stage: currentState.stage,
      stage: newStage,
      reason: reason ?? null,
      changed_by: auditContext?.userId ?? null,
    };

    await userRepository.updateApplicationState(applicationId, updateValues, {
      transaction,
    });

    // -----------------------------------------------------------------------
    // Record audit action
    // -----------------------------------------------------------------------

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.APPLICATION_STATUS_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.APPLICATION,
      entityId: applicationId,
      applicationId,
      previousData,
      newData: {
        status: newStatus,
        stage: newStage,
        reason: reason ?? null,
      },
      metadata: {
        applicantId,
        operation: "update",
      },
      options: {
        transaction,
      },
    });

    // -----------------------------------------------------------------------
    // Return updated state
    // -----------------------------------------------------------------------

    return {
      applicantId,
      applicationId,
      status: newStatus,
      stage: newStage,
      reason: reason ?? null,
    };
  });
};

const updateApplicantApplicationStatus = async ({
  applicantId,
  applicationId,
  status,
  stage,
  reason,
  changedBy,
  auditContext,
}) => {
  const application = await userRepository.findApplicantApplicationByIds(
    applicantId,
    applicationId,
  );

  if (!application) {
    throw new NotFoundError("Applicant application not found.");
  }

  return applicationStatusService.updateApplicationStatus({
    applicantId,
    status,
    stage,
    reason,
    changedBy,
    auditContext,
  });
};

/**
 * -----------------------------------------------------------------------------
 * Update User Role
 * -----------------------------------------------------------------------------
 */
const updateUserRole = async (applicantId, roleId, auditContext) => {
  return sequelize.transaction(async (transaction) => {
    const user = await userRepository.findUserWithRoleById(applicantId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!user) {
      throw new NotFoundError("Applicant not found.");
    }

    const role = await userRepository.findRoleById(roleId, {
      transaction,
    });

    if (!role) {
      throw new NotFoundError("Role not found.");
    }

    const previousRole = user.role;

    if (user.role_id === roleId) {
      return user;
    }

    await userRepository.updateUserRole(applicantId, roleId, {
      transaction,
    });

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.USER_ROLE_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.USER,
      entityId: applicantId,
      previousData: {
        role_id: user.role_id,
        role_name: previousRole?.name ?? null,
      },
      newData: {
        role_id: role.id,
        role_name: role.name,
      },
      metadata: {
        applicantId,
        operation: "role_update",
      },
      options: {
        transaction,
      },
    });

    return userRepository.findUserWithRoleById(applicantId, {
      transaction,
    });
  });
};
export {
  getUserProfile,
  updateUserProfile,
  updateUserEmail,
  updateUserPassword,
  updateUserAccountStatus,
  updateApplicationState,
  updateApplicantApplicationStatus,
  updateUserRole,
};
