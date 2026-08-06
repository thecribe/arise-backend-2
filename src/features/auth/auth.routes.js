import { Router } from "express";

import { authController } from "./auth.controller.js";
import { authenticate } from "../../common/middleware/authenticate.js";

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.get("/verify-email", authController.verifyEmail);
authRouter.post("/set-password", authController.setPassword);
authRouter.post("/login", authController.login);
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.get("/me", authenticate, authController.me);
authRouter.post("/logout", authenticate, authController.logout);
authRouter.post("/logout-all", authenticate, authController.logoutAll);

export { authRouter };
