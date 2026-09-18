import { Router } from "express";
import { authRouter } from "../../features/auth/auth.routes.js";
import { jobTypeRouter } from "../../features/job-types/job-type.routes.js";
import { applicationDefinitionRouter } from "../../features/application-definition/application-definition.routes.js";
import { applicantApplicationRouter } from "../../features/applicant-application/applicant-application.routes.js";
import { dashboardRouter } from "../../features/dashboard/dashboard.router.js";
import { recruitmentRouter } from "../../features/recruitment/recruitment.router.js";
import { referenceRouter } from "../../features/reference/reference.router.js";
import trainingCertificateRouter from "../../features/trainingcertificate/trainingcertificate.router.js";
import applicantTrainingCertificateRouter from "../../features/trainingcertificate/applicant/applicant-training-certificate.router.js";

const apiV1Router = Router();

apiV1Router.use("/auth", authRouter);
apiV1Router.use("/job-types", jobTypeRouter);
apiV1Router.use("/application-definitions", applicationDefinitionRouter);
apiV1Router.use("/applicant-application", applicantApplicationRouter);
apiV1Router.use("/dashboard", dashboardRouter);
apiV1Router.use("/recruitment", recruitmentRouter);
apiV1Router.use("/references", referenceRouter);
apiV1Router.use(
  "/training-certificate-requirements",
  trainingCertificateRouter,
);
apiV1Router.use(
  "/recruitment/training-certificates",
  applicantTrainingCertificateRouter,
);

export { apiV1Router };
