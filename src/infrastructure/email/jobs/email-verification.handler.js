import { env } from "../../../config/env.js";

import { emailService } from "../email.service.js";
import { emailVerificationTemplate } from "../templates/email-verification.template.js";

const emailVerificationHandler = async (payload) => {
  const verificationUrl = `${env.APP_URL}/verify-email?token=${payload.token}&type=${payload.type}`;

  const template = emailVerificationTemplate({
    firstName: payload.firstName,
    verificationUrl,
  });

  await emailService.send({
    to: payload.email,
    subject: template.subject,
    html: template.html,
  });
};

export { emailVerificationHandler };
