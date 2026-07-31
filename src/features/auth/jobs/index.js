import { JOB_TYPES } from "../../../common/constants/job-types.js";
import { registerHandler } from "../../../infrastructure/jobs/job.handlers.js";



import { emailVerificationHandler } from "./email-verification.handler.js";

registerHandler(JOB_TYPES.EMAIL_VERIFICATION, emailVerificationHandler);
