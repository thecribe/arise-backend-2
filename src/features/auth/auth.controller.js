import { createAuditContext } from "../../common/audit/audit-context.js";
import { BadRequestError } from "../../common/errors/bad-request-error.js";
import { ApiResponse } from "../../common/responses/api-response.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { authCookie } from "../../common/utils/auth-cookie.js";

import { authService } from "./auth.service.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  setPasswordSchema,
} from "./auth.validation.js";

const register = asyncHandler(async (req, res) => {
  const payload = registerSchema.parse(req.body);

  const auditContext = createAuditContext(req);

  await authService.register(payload, auditContext);

  return ApiResponse.success(
    res,
    null,
    "Registration successful. Please check your email to verify your email address.",
    201,
  );
});

const forgotPassword = asyncHandler(async (req, res) => {
  const payload = forgotPasswordSchema.parse(req.body);

  const auditContext = createAuditContext(req);

  await authService.forgotPassword(payload.email, auditContext);

  return ApiResponse.success(
    res,
    null,
    "If an account with that email exists, a password reset link has been sent.",
  );
});

const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.query.token;

  if (!token) {
    throw new BadRequestError("Verification token is required.");
  }

  const auditContext = createAuditContext(req);

  const setPasswordToken = await authService.verifyEmail(token, auditContext);

  return ApiResponse.success(
    res,
    { setPasswordToken },
    "Email verified successfully.",
  );
});

const setPassword = asyncHandler(async (req, res) => {
  const payload = setPasswordSchema.parse(req.body);

  const auditContext = createAuditContext(req);

  await authService.setPassword(payload, auditContext);

  return ApiResponse.success(res, null, "Password created successfully.");
});

const login = asyncHandler(async (req, res) => {
  const payload = loginSchema.parse(req.body);

  const auditContext = createAuditContext(req);

  const { user, accessToken, refreshToken } = await authService.login(
    payload,
    auditContext,
  );

  authCookie.setAuthCookies(res, {
    accessToken,
    refreshToken,
  });

  return ApiResponse.success(
    res,
    {
      user,
    },
    "Login successful.",
  );
});

/**
 * -----------------------------------------------------------------------------
 * Returns the currently authenticated user.
 *
 * The authenticate middleware has already:
 * - validated the session
 * - loaded the user
 * - loaded the role
 * - loaded the permissions
 *
 * Therefore this controller simply returns req.user.
 * -----------------------------------------------------------------------------
 */

const me = asyncHandler(async (req, res) => {
  return ApiResponse.success(
    res,
    {
      user: req.user,
    },
    "Authenticated user retrieved successfully.",
  );
});

const logout = asyncHandler(async (req, res) => {
  const auditContext = createAuditContext(req);

  await authService.logout(req.session, auditContext);

  authCookie.clearAuthCookies(res);

  return ApiResponse.success(res, null, "Logged out successfully.");
});

const logoutAll = asyncHandler(async (req, res) => {
  const auditContext = createAuditContext(req);

  await authService.logoutAll(req.user.id, auditContext);

  authCookie.clearAuthCookies(res);

  return ApiResponse.success(
    res,
    null,
    "Logged out from all devices successfully.",
  );
});

export const authController = {
  register,
  verifyEmail,
  setPassword,
  forgotPassword,
  login,
  me,
  logout,
  logoutAll,
};
