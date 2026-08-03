import { resend } from "./resend.client.js";

const send = async ({ to, subject, html }) => {
  return resend.emails.send({
    from: "Arise Recruitment <support@developer.cribe.org>",

    to,

    subject,

    html,
  });
};

export const emailService = {
  send,
};
