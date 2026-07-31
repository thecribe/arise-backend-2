import { Router } from "express";

import { authController } from "./auth.controller.js";

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.get("/verify-email", authController.verifyEmail);
authRouter.post("/set-password", authController.setPassword);

export { authRouter };
