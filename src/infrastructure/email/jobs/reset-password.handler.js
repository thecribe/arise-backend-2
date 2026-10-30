import { env } from "../../../config/env.js";
import { getEmailSettings } from "../email-settings.service.js";
import { emailService } from "../email.service.js";
import { forgotPasswordTemplate } from "../templates/forgot-password.template.js";

const resetPasswordHandler = async (payload) => {
  const forgotPasswordUrl = `${env.APP_URL}/reset-password?token=${encodeURIComponent(payload.token)}`;

  const settings = await getEmailSettings();

  const template = forgotPasswordTemplate({
    firstName: payload.firstName,
    forgotPasswordUrl,
    settings,
  });

  await emailService.send({
    to: payload.email,
    subject: template.subject,
    html: template.html,
  });
};

export { resetPasswordHandler };
