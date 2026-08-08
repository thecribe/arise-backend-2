import { Router } from "express";
import { authRouter } from "../../features/auth/auth.routes.js";
import { jobTypeRouter } from "../../features/job-types/job-type.routes.js";
import { applicationDefinitionRouter } from "../../features/application-definition/application-definition.routes.js";
import { applicantApplicationRouter } from "../../features/applicant-application/applicant-application.routes.js";

const apiV1Router = Router();

apiV1Router.use("/auth", authRouter);
apiV1Router.use("/job-types", jobTypeRouter);
apiV1Router.use("/application-definitions", applicationDefinitionRouter);
apiV1Router.use("/applicant-application", applicantApplicationRouter);

export { apiV1Router };
