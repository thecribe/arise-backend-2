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
import applicantComplianceRouter from "../../features/compliance/applicant-compliance/forms/applicant-complaince-forms.router.js";
import referenceApplicantRouter from "../../features/compliance/applicant-compliance/reference/applicant-complaince-reference.route.js";
import trainingCertificateApplicantRouter from "../../features/compliance/applicant-compliance/compliance/applicant-training-certificate.routes.js";
import InterviewRouter from "../../features/interview/applicant-interview.routes.js";
import interviewDefinitionRouter from "../../features/interview/definition/interview-definition.routes.js";
import DocumentsRouter from "../../features/documents/documents.route.js";

const apiV1Router = Router();

apiV1Router.use("/auth", authRouter);
apiV1Router.use("/job-types", jobTypeRouter);
apiV1Router.use("/application-definitions", applicationDefinitionRouter);
apiV1Router.use("/applicant-application", applicantApplicationRouter);
apiV1Router.use("/applicant-application", applicantComplianceRouter);
apiV1Router.use("/applicant-application", referenceApplicantRouter);
apiV1Router.use("/applicant-application", trainingCertificateApplicantRouter);
apiV1Router.use("/applicant-application", InterviewRouter);
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
apiV1Router.use("/interview", interviewDefinitionRouter);
apiV1Router.use("/documents", DocumentsRouter);

export { apiV1Router };
