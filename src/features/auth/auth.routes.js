import { Router } from "express";

import { authController } from "./auth.controller.js";
import { authenticate } from "../../common/middleware/authenticate.js";
import {
  authRateLimiter,
  sensitiveRateLimiter,
} from "../../common/middleware/rate-limiter.js";

const authRouter = Router();

authRouter.post("/register", authRateLimiter, authController.register);
authRouter.get(
  "/verify-email",
  sensitiveRateLimiter,
  authController.verifyEmail,
);
authRouter.post(
  "/set-password",
  sensitiveRateLimiter,
  authController.setPassword,
);
authRouter.post("/login", authRateLimiter, authController.login);
authRouter.post(
  "/forgot-password",
  authRateLimiter,
  authController.forgotPassword,
);
authRouter.get("/me", authenticate, authController.me);
authRouter.post("/logout", authenticate, authController.logout);
authRouter.post("/logout-all", authenticate, authController.logoutAll);

export { authRouter };
