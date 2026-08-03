import { Router } from "express";
import { authRouter } from "../../features/auth/auth.routes.js";
import { jobTypeRouter } from "../../features/job-types/job-type.routes.js";

const apiV1Router = Router();

apiV1Router.use("/auth", authRouter);
apiV1Router.use("/job-types", jobTypeRouter);

export { apiV1Router };
