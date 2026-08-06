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

   await authService.register(payload);


  return ApiResponse.success(
    res,
    null,
    "Registration successful. Please check your email to verify your email address.",
    201,
  );
});

const forgotPassword = asyncHandler(async (req, res) => {
  const payload = forgotPasswordSchema.parse(req.body);

  await authService.forgotPassword(payload.email);

  return ApiResponse.success(
    res,
    null,
    "If an account with that email exists, a password reset link has been sent."
  );
});

const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.query.token;

  if (!token) {
    throw new Error("Verification token is required.");
  }

  const setPasswordToken = await authService.verifyEmail(token);

  // return res.redirect(
  //   `${env.APP_URL}/set-password?token=${setPasswordToken}`,
  // );
  return ApiResponse.success(res, {setPasswordToken}, "Email verified successfully.");
});

const setPassword = asyncHandler(async (req, res) => {
  const payload = setPasswordSchema.parse(req.body);

  await authService.setPassword(payload);

  return ApiResponse.success(res, null, "Password created successfully.");
});

const login = asyncHandler(async (req, res) => {
  const payload = loginSchema.parse(req.body);

  const { user, accessToken, refreshToken } = await authService.login(
    payload,
    req,
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
  await authService.logout(req.session);

  authCookie.clearAuthCookies(res);

  return ApiResponse.success(res, null, "Logged out successfully.");
});

const logoutAll = asyncHandler(async (req, res) => {
  await authService.logoutAll(req.user.id);

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
