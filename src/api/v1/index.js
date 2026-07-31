import { Router } from "express";
import { authRouter } from "../../features/auth/auth.routes.js";

const apiV1Router = Router();

apiV1Router.use("/auth", authRouter);

export { apiV1Router };
