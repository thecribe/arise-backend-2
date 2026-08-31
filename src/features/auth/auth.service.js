import crypto from "crypto";

import { sequelize } from "../../config/database.js";

import { authRepository } from "./auth.repository.js";

import { TOKEN_TYPES } from "../../common/constants/token-types.js";
import { tokenService } from "../../common/services/token.service.js";
import { jobService } from "../../infrastructure/jobs/job.service.js";
import { JOB_TYPES } from "../../common/constants/job-types.js";
import { passwordService } from "../../common/services/password.service.js";
import { jwtService } from "../../common/services/jwt.service.js";
import { userMapper } from "./mappers/user.mapper.js";
import { SESSION_DURATION } from "../../common/constants/auth.js";
import { ForbiddenError } from "../../common/errors/forbidden-error.js";
import { UnauthorizedError } from "../../common/errors/unauthorized-error.js";
import { NotFoundError } from "../../common/errors/not-found-error.js";
import { recordAuditAction } from "../audit/record-audit-action.js";
import { AUDIT_ACTIONS } from "../../common/constants/audit-actions.js";
import { AUDIT_ENTITY_TYPES } from "../../common/constants/audit-entity-types.js";

const register = async (payload, auditContext) => {
  const existingUser = await authRepository.findUserByEmail(payload.email);

  if (existingUser) {
    throw new ForbiddenError("Email address already exists.");
  }

  const transaction = await sequelize.transaction();

  try {
    const applicantRole = await authRepository.findRoleByName("APPLICANT");

    const defaultJobType = await authRepository.findDefaultJobType();

    if (!applicantRole) {
      throw new NotFoundError("Applicant role not found.");
    }

    if (!defaultJobType) {
      throw new NotFoundError("Default job type not found.");
    }

    /**
     * ----------------------------------------------------------------------
     * Create user
     * ----------------------------------------------------------------------
     */

    const user = await authRepository.createUser(
      {
        first_name: payload.firstName,
        last_name: payload.lastName,
        email: payload.email,
        phone_number: payload.phoneNumber,
        address: payload.address,
        postcode: payload.postcode,
        role_id: applicantRole.id,
        job_type_id: payload.jobTypeId ?? defaultJobType.id,
      },
      transaction,
    );

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
          email: user.email,
          token: verificationToken,
        },
      },
      transaction,
    );

    /**
     * ----------------------------------------------------------------------
     * Record audit action
     *
     * This is intentionally inside the same transaction as user creation.
     *
     * Never store verification tokens or token hashes in audit logs.
     * ----------------------------------------------------------------------
     */

    await recordAuditAction({
      auditContext,

      action: AUDIT_ACTIONS.USER_REGISTERED,

      entityType: AUDIT_ENTITY_TYPES.USER,

      entityId: user.id,

      newData: {
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phoneNumber: user.phone_number,
        address: user.address,
        postcode: user.postcode,
        roleId: user.role_id,
        jobTypeId: user.job_type_id,
      },

      metadata: {
        registrationType: "applicant",
      },

      options: {
        transaction,
      },
    });

    /**
     * ----------------------------------------------------------------------
     * Commit transaction
     * ----------------------------------------------------------------------
     */

    await transaction.commit();

    return {
      user,
      verificationToken,
    };
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

const verifyEmail = async (token, auditContext) => {
  const tokenHash = tokenService.hash(token);

  const verificationToken = await authRepository.findToken({
    tokenHash,
    type: TOKEN_TYPES.EMAIL_VERIFICATION,
  });

  if (!verificationToken) {
    throw new UnauthorizedError("Invalid or expired verification link.");
  }

  const transaction = await sequelize.transaction();

  try {
    /**
     * ----------------------------------------------------------------------
     * Capture previous email verification state
     * ----------------------------------------------------------------------
     */

    const previousData = {
      isEmailVerified: false,

      emailVerifiedAt: null,
    };

    /**
     * ----------------------------------------------------------------------
     * Verify user email
     * ----------------------------------------------------------------------
     */

    await authRepository.verifyUserEmail(verificationToken.user, transaction);

    /**
     * ----------------------------------------------------------------------
     * Mark verification token as used
     * ----------------------------------------------------------------------
     */

    await authRepository.markTokenAsUsed(verificationToken, transaction);

    /**
     * ----------------------------------------------------------------------
     * Generate set password token
     * ----------------------------------------------------------------------
     */

    const setPasswordToken = tokenService.generate();

    await authRepository.createToken(
      {
        user_id: verificationToken.user.id,

        type: TOKEN_TYPES.SET_PASSWORD,

        token_hash: tokenService.hash(setPasswordToken),

        expires_at: new Date(Date.now() + 60 * 60 * 1000),
      },
      transaction,
    );

    /**
     * ----------------------------------------------------------------------
     * Record email verification audit action
     *
     * Never store:
     * - verification token
     * - token hash
     * - set password token
     * ----------------------------------------------------------------------
     */

    await recordAuditAction({
      auditContext: {
        ...auditContext,

        /**
         * The verification token identifies the user performing
         * this action.
         */
        userId: verificationToken.user.id,
      },

      action: AUDIT_ACTIONS.EMAIL_VERIFIED,

      entityType: AUDIT_ENTITY_TYPES.USER,

      entityId: verificationToken.user.id,

      previousData,

      newData: {
        isEmailVerified: true,
      },

      metadata: {
        verificationMethod: "email_verification_link",
      },

      options: {
        transaction,
      },
    });

    /**
     * ----------------------------------------------------------------------
     * Commit transaction
     * ----------------------------------------------------------------------
     */

    await transaction.commit();

    return setPasswordToken;
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

const forgotPassword = async (email, auditContext) => {
  /**
   * ----------------------------------------------------------------------
   * Find user
   *
   * Do not reveal whether the email exists.
   * ----------------------------------------------------------------------
   */

  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    return null;
  }

  /**
   * ----------------------------------------------------------------------
   * Generate reset password token
   *
   * The raw token and token hash must never be stored
   * in audit logs.
   * ----------------------------------------------------------------------
   */

  const resetPasswordToken = tokenService.generate();

  const tokenHash = tokenService.hash(resetPasswordToken);

  const transaction = await sequelize.transaction();

  try {
    /**
     * ----------------------------------------------------------------------
     * Create reset token
     * ----------------------------------------------------------------------
     */

    await authRepository.createToken(
      {
        user_id: user.id,

        type: TOKEN_TYPES.SET_PASSWORD,

        token_hash: tokenHash,

        expires_at: new Date(Date.now() + 60 * 60 * 1000),
      },
      transaction,
    );

    /**
     * ----------------------------------------------------------------------
     * Queue password reset email
     * ----------------------------------------------------------------------
     */

    await jobService.dispatch(
      {
        type: JOB_TYPES.PASSWORD_RESET,

        payload: {
          userId: user.id,

          firstName: user.first_name,

          email: user.email,

          token: resetPasswordToken,
        },
      },
      transaction,
    );

    /**
     * ----------------------------------------------------------------------
     * Record audit event
     *
     * Do not store:
     * - email
     * - reset token
     * - token hash
     * ----------------------------------------------------------------------
     */

    await recordAuditAction({
      auditContext: {
        ...auditContext,
        userId: user.id,
      },

      action: AUDIT_ACTIONS.PASSWORD_RESET_REQUESTED,

      entityType: AUDIT_ENTITY_TYPES.USER,

      entityId: user.id,

      previousData: null,

      newData: {
        passwordResetRequested: true,
      },

      metadata: {
        resetMethod: "email_link",
      },

      options: {
        transaction,
      },
    });

    /**
     * ----------------------------------------------------------------------
     * Commit transaction
     * ----------------------------------------------------------------------
     */

    await transaction.commit();

    return {
      user,

      resetPasswordToken,
    };
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

const setPassword = async ({ token, password }, auditContext) => {
  const tokenHash = tokenService.hash(token);

  const setPasswordToken = await authRepository.findToken({
    tokenHash,
    type: TOKEN_TYPES.SET_PASSWORD,
  });

  if (!setPasswordToken) {
    throw new UnauthorizedError("Invalid or expired link.");
  }

  const transaction = await sequelize.transaction();

  try {
    /**
     * ----------------------------------------------------------------------
     * Hash password
     *
     * The raw password must never be recorded in audit logs.
     * ----------------------------------------------------------------------
     */

    const hashedPassword = await passwordService.hash(password);

    /**
     * ----------------------------------------------------------------------
     * Update password
     * ----------------------------------------------------------------------
     */

    await authRepository.updatePassword(
      setPasswordToken.user,
      hashedPassword,
      transaction,
    );

    /**
     * ----------------------------------------------------------------------
     * Ensure email is verified
     * ----------------------------------------------------------------------
     */

    if (!setPasswordToken.user.is_email_verified) {
      await authRepository.verifyUserEmail(setPasswordToken.user, transaction);
    }

    /**
     * ----------------------------------------------------------------------
     * Mark set-password token as used
     * ----------------------------------------------------------------------
     */

    await authRepository.markTokenAsUsed(setPasswordToken, transaction);

    /**
     * ----------------------------------------------------------------------
     * Record password creation audit action
     *
     * Never include:
     * - password
     * - hashed password
     * - token
     * - token hash
     * ----------------------------------------------------------------------
     */

    await recordAuditAction({
      auditContext: {
        ...auditContext,

        /**
         * The valid set-password token identifies the user
         * performing this action.
         */
        userId: setPasswordToken.user.id,
      },

      action: AUDIT_ACTIONS.PASSWORD_CREATED,

      entityType: AUDIT_ENTITY_TYPES.USER,

      entityId: setPasswordToken.user.id,

      previousData: null,

      newData: {
        passwordCreated: true,
      },

      metadata: {
        passwordAction: "initial_password_creation",
      },

      options: {
        transaction,
      },
    });

    /**
     * ----------------------------------------------------------------------
     * Commit transaction
     * ----------------------------------------------------------------------
     */

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

const login = async ({ email, password }, auditContext) => {
  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    throw new ForbiddenError("Invalid email or password.");
  }

  if (!user.is_email_verified) {
    throw new ForbiddenError("Please verify your email address.");
  }

  if (!user.password) {
    throw new ForbiddenError("Please complete your account setup.");
  }

  const passwordMatches = await passwordService.compare(
    password,
    user.password,
  );

  if (!passwordMatches) {
    throw new UnauthorizedError("Invalid email or password.");
  }

  const transaction = await sequelize.transaction();

  try {
    /**
     * ----------------------------------------------------------------------
     * Capture previous login state for audit logging.
     * ----------------------------------------------------------------------
     */

    const previousLastLoginAt = user.last_login_at;

    /**
     * ----------------------------------------------------------------------
     * Create session
     * ----------------------------------------------------------------------
     */

    const session = await authRepository.createSession(
      {
        user_id: user.id,

        device_name: null,

        ip_address: auditContext.ipAddress,

        user_agent: auditContext.userAgent,

        expires_at: new Date(Date.now() + SESSION_DURATION),
      },
      transaction,
    );

    /**
     * ----------------------------------------------------------------------
     * Generate tokens
     *
     * Tokens are intentionally NOT included in audit logs.
     * ----------------------------------------------------------------------
     */

    const accessToken = jwtService.generateAccessToken({
      userId: user.id,
      sessionId: session.id,
    });

    const refreshToken = jwtService.generateRefreshToken({
      userId: user.id,
      sessionId: session.id,
    });

    /**
     * ----------------------------------------------------------------------
     * Store refresh token hash
     * ----------------------------------------------------------------------
     */

    await authRepository.updateSession(
      session,
      {
        refresh_token_hash: tokenService.hash(refreshToken),
      },
      transaction,
    );

    /**
     * ----------------------------------------------------------------------
     * Update last login
     * ----------------------------------------------------------------------
     */

    await authRepository.updateLastLogin(user, transaction);

    /**
     * ----------------------------------------------------------------------
     * Record login audit event
     * ----------------------------------------------------------------------
     */

    await recordAuditAction({
      auditContext: {
        ...auditContext,
        userId: user.id,
      },

      action: AUDIT_ACTIONS.USER_LOGGED_IN,

      entityType: AUDIT_ENTITY_TYPES.USER,

      entityId: user.id,

      previousData: {
        lastLoginAt: previousLastLoginAt
          ? new Date(previousLastLoginAt).toISOString()
          : null,
      },

      newData: {
        lastLoginAt: new Date().toISOString(),
      },

      metadata: {
        sessionId: session.id,

        authenticationMethod: "email_password",
      },

      options: {
        transaction,
      },
    });

    /**
     * ----------------------------------------------------------------------
     * Commit
     * ----------------------------------------------------------------------
     */

    await transaction.commit();

    return {
      user: userMapper.toAuthenticatedUser(user),

      accessToken,

      refreshToken,
    };
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

/**
 * Logout the current session.
 */

const logout = async (session, auditContext) => {
  const transaction = await sequelize.transaction();

  try {
    /**
     * Revoke current session.
     */

    await authRepository.revokeSession(session, transaction);

    /**
     * Record logout.
     */

    await recordAuditAction({
      auditContext: {
        ...auditContext,

        userId: session.user_id,
      },

      action: AUDIT_ACTIONS.USER_LOGGED_OUT,

      entityType: AUDIT_ENTITY_TYPES.USER,

      entityId: session.user_id,

      previousData: {
        sessionActive: true,
      },

      newData: {
        sessionActive: false,
      },

      metadata: {
        sessionId: session.id,
        logoutScope: "current_session",
      },

      options: {
        transaction,
      },
    });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

/**
 * Logout from every device.
 */

const logoutAll = async (userId, auditContext) => {
  const transaction = await sequelize.transaction();

  try {
    /**
     * Revoke all user sessions.
     */

    await authRepository.revokeAllSessions(userId, transaction);

    /**
     * Record logout all devices.
     */

    await recordAuditAction({
      auditContext: {
        ...auditContext,

        userId,
      },

      action: AUDIT_ACTIONS.USER_LOGGED_OUT_ALL_DEVICES,

      entityType: AUDIT_ENTITY_TYPES.USER,

      entityId: userId,

      previousData: null,

      newData: {
        sessionsRevoked: true,
      },

      metadata: {
        logoutScope: "all_devices",
      },

      options: {
        transaction,
      },
    });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};
export const authService = {
  register,
  verifyEmail,
  setPassword,
  forgotPassword,
  login,
  logout,
  logoutAll,
};
