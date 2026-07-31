import { ApiResponse } from "../../common/responses/api-response.js";
import { asyncHandler } from "../../common/utils/async-handler.js";

import { authService } from "./auth.service.js";
import { registerSchema, setPasswordSchema } from "./auth.validation.js";

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

const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.query.token;

  if (!token) {
    throw new Error("Verification token is required.");
  }

  const setPasswordToken = await authService.verifyEmail(token);

  return res.redirect(
    `${env.FRONTEND_URL}/set-password?token=${setPasswordToken}`,
  );
});

const setPassword = asyncHandler(async (req, res) => {
  const payload = setPasswordSchema.parse(req.body);

  await authService.setPassword(payload);

  return ApiResponse.success(res, null, "Password created successfully.");
});
export const authController = {
  register,
  verifyEmail,
  setPassword,
};
