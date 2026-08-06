import { JOB_TYPES } from "../../../common/constants/job-types.js";
import { registerHandler } from "../../../infrastructure/jobs/job.handlers.js";



import { emailVerificationHandler } from "./email-verification.handler.js";
import { resetPasswordHandler } from "./reset-password.handler.js";

registerHandler(JOB_TYPES.EMAIL_VERIFICATION, emailVerificationHandler);
registerHandler(JOB_TYPES.PASSWORD_RESET, resetPasswordHandler);
