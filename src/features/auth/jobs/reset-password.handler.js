import { env } from "../../../config/env.js";

import { emailService } from "../../../infrastructure/email/email.service.js";
import { forgotPasswordTemplate } from "../../../infrastructure/email/templates/forgot-password.template.js";

const resetPasswordHandler = async (payload) => {
  const forgotPasswordUrl = `${env.APP_URL}/reset-password?token=${payload.token}`;

  const template = forgotPasswordTemplate({
    firstName: payload.firstName,
    forgotPasswordUrl,
  });

  await emailService.send({
    to: payload.email,
    subject: template.subject,
    html: template.html,
  });
};

export { resetPasswordHandler };
