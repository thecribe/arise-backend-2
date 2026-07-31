import { resend } from "./resend.client.js";

const send = async ({ to, subject, html }) => {
  return resend.emails.send({
    from: "Airse Recruitment <noreply@yourdomain.com>",

    to,

    subject,

    html,
  });
};

export const emailService = {
  send,
};
