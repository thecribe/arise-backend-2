import { env } from "../../../config/env.js";
import { getEmailSettings } from "../email-settings.service.js";
import { emailService } from "../email.service.js";
import { referenceRequestTemplate } from "../templates/reference-request.template.js";

const referenceRequestHandler = async (payload) => {
  const referenceUrl = `${env.APP_URL}/referee-form/${encodeURIComponent(payload.referenceId)}?token=${encodeURIComponent(payload.token)}`;

  const settings = await getEmailSettings();

  const template = referenceRequestTemplate({
    refereeName: payload.refereeName,
    applicantName: payload.applicantName,
    referenceUrl,
    settings,
  });

  await emailService.send({
    to: payload.refereeEmail,
    subject: template.subject,
    html: template.html,
  });
};

export { referenceRequestHandler };
