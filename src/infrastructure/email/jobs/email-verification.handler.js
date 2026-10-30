import { env } from "../../../config/env.js";
import { getEmailSettings } from "../email-settings.service.js";
import { emailService } from "../email.service.js";
import { emailVerificationTemplate } from "../templates/email-verification.template.js";

const emailVerificationHandler = async (payload) => {
  const verificationUrl = `${env.APP_URL}/verify-email?token=${encodeURIComponent(payload.token)}&type=${encodeURIComponent(payload.type)}`;

  const settings = await getEmailSettings();

  const template = emailVerificationTemplate({
    firstName: payload.firstName,
    verificationUrl,
    settings,
  });

  await emailService.send({
    to: payload.email,
    subject: template.subject,
    html: template.html,
  });
};

export { emailVerificationHandler };
