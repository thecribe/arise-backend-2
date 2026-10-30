import { emailLayout } from "../email-layout.js";

const emailVerificationTemplate = ({
  firstName,
  verificationUrl,
  settings,
}) => {
  const content = `
    <h2 style="
      margin: 0 0 20px;
      font-size: 23px;
      color: #1e3a5f;
      font-weight: 700;
    ">
      Verify your email address
    </h2>

    <p>Hello ${escapeHtml(firstName)},</p>

    <p>
      Thank you for registering with
      ${escapeHtml(settings.organisationName)}.
      We're pleased to have you join us.
    </p>

    <p>
      To continue with your recruitment application,
      please verify your email address by clicking the
      button below.
    </p>

    <div style="text-align:center;margin:30px 0;">
      <a
        href="${escapeHtml(verificationUrl)}"
        style="
          display:inline-block;
          padding:14px 28px;
          background-color:#2563eb;
          color:#ffffff;
          text-decoration:none;
          border-radius:6px;
          font-size:14px;
          font-weight:600;
        "
      >
        Verify Email Address
      </a>
    </div>

    <p style="font-size:13px;color:#64748b;">
      If the button above doesn't work, copy and paste
      the following link into your browser:
    </p>

    <p style="font-size:13px;word-break:break-all;">
      <a
        href="${escapeHtml(verificationUrl)}"
        style="color:#2563eb;"
      >
        ${escapeHtml(verificationUrl)}
      </a>
    </p>

    <p>
      If you did not create this account, you can safely
      ignore this email.
    </p>

    <p style="margin-top:28px;">
      Kind regards,<br />
      <strong>${escapeHtml(settings.organisationName)} Team</strong>
    </p>
  `;

  return {
    subject: "Verify your email address",

    html: emailLayout({
      settings,
      content,
      previewText: "Verify your email address to continue your application.",
    }),
  };
};

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export { emailVerificationTemplate };
