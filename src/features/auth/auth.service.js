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

const register = async (payload) => {
  const existingUser = await authRepository.findUserByEmail(payload.email);

  if (existingUser) {
    throw new Error("Email address already exists.");
  }
  console.log(payload);
  const transaction = await sequelize.transaction();

  try {
    const applicantRole = await authRepository.findRoleByName("APPLICANT");
    const defaultJobType = await authRepository.findDefaultJobType();

    if (!applicantRole) {
      throw new Error("Applicant role not found.");
    }

    if (!defaultJobType) {
      throw new Error("Default job type not found.");
    }

    /**
     * Create user
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
     * Applicant role
     */

    /**
     * Generate verification token
     */
    const verificationToken = tokenService.generate();

    const tokenHash = tokenService.hash(verificationToken);

    /**
     * Save token
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
     * TODO
     * Queue verification email
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

    await transaction.commit();

    return {
      user,
      verificationToken: token,
    };
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

const verifyEmail = async (token) => {
  const tokenHash = tokenService.hash(token);

  const verificationToken = await authRepository.findToken({
    tokenHash,
    type: TOKEN_TYPES.EMAIL_VERIFICATION,
  });

  if (!verificationToken) {
    throw new Error("Invalid or expired verification link.");
  }

  const transaction = await sequelize.transaction();

  try {
    await authRepository.verifyUserEmail(verificationToken.user, transaction);

    await authRepository.markTokenAsUsed(verificationToken, transaction);

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

    await transaction.commit();

    return setPasswordToken;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const setPassword = async ({ token, password }) => {
  const tokenHash = tokenService.hash(token);

  const setPasswordToken = await authRepository.findToken({
    tokenHash,
    type: TOKEN_TYPES.SET_PASSWORD,
  });

  if (!setPasswordToken) {
    throw new Error("Invalid or expired link.");
  }

  const transaction = await sequelize.transaction();

  try {
    const hashedPassword = await passwordService.hash(password);

    await authRepository.updatePassword(
      setPasswordToken.user,
      hashedPassword,
      transaction,
    );

    await authRepository.markTokenAsUsed(setPasswordToken, transaction);

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

const login = async ({ email, password }, request) => {
  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    throw new UnauthorizedException("Invalid email or password.");
  }

  if (!user.is_email_verified) {
    throw new UnauthorizedException("Please verify your email address.");
  }

  if (!user.password) {
    throw new UnauthorizedException("Please complete your account setup.");
  }

  const passwordMatches = await passwordService.compare(
    password,
    user.password,
  );

  if (!passwordMatches) {
    throw new UnauthorizedException("Invalid email or password.");
  }

  const transaction = await sequelize.transaction();

  try {
    const session = await authRepository.createSession(
      {
        user_id: user.id,

        device_name: null, //request.headers["sec-ch-ua"] ??

        ip_address: request.ip,

        user_agent: request.headers["user-agent"],

        expires_at: new Date(Date.now() + SESSION_DURATION),
      },
      transaction,
    );

    const accessToken = jwtService.generateAccessToken({
      userId: user.id,
      sessionId: session.id,
    });

    const refreshToken = jwtService.generateRefreshToken({
      userId: user.id,
      sessionId: session.id,
    });

    await authRepository.updateSession(
      session,
      {
        refresh_token_hash: tokenService.hash(refreshToken),
      },
      transaction,
    );

    await authRepository.updateLastLogin(user, transaction);

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
const logout = async (session) => {
  const transaction = await sequelize.transaction();

  try {
    await authRepository.revokeSession(session, transaction);

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

/**
 * Logout from every device.
 */
const logoutAll = async (userId) => {
  const transaction = await sequelize.transaction();

  try {
    await authRepository.revokeAllSessions(userId, transaction);

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
  login,
  logout,
  logoutAll,
};
