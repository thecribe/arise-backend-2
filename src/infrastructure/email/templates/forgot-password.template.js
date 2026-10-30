import { emailLayout } from "../email-layout.js";

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const forgotPasswordTemplate = ({ firstName, forgotPasswordUrl, settings }) => {
  const content = `
    <h2 style="
      margin: 0 0 20px;
      font-size: 23px;
      color: #1e3a5f;
      font-weight: 700;
    ">
      Reset your password
    </h2>

    <p>Hello ${escapeHtml(firstName)},</p>

    <p>
      We received a request to reset the password associated
      with your ${escapeHtml(settings.siteName)} account.
    </p>

    <p>
      Click the button below to create a new password.
    </p>

    <div style="text-align:center;margin:30px 0;">
      <a
        href="${escapeHtml(forgotPasswordUrl)}"
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
        Reset Password
      </a>
    </div>

    <p style="font-size:13px;color:#64748b;">
      If the button doesn't work, copy and paste the
      following link into your browser:
    </p>

    <p style="font-size:13px;word-break:break-all;">
      <a
        href="${escapeHtml(forgotPasswordUrl)}"
        style="color:#2563eb;"
      >
        ${escapeHtml(forgotPasswordUrl)}
      </a>
    </p>

    <div style="
      background-color:#eff6ff;
      border-left:3px solid #2563eb;
      padding:14px 16px;
      margin:24px 0;
    ">
      <p style="margin:0;font-size:13px;color:#1e40af;">
        <strong>Security notice:</strong>
        If you did not request a password reset, you can
        safely ignore this email. Your password will remain unchanged.
      </p>
    </div>

    <p>
      For security reasons, do not share this link with anyone.
    </p>

    <p style="margin-top:28px;">
      Kind regards,<br />
      <strong>${escapeHtml(settings.organisationName)} Team</strong>
    </p>
  `;

  return {
    subject: "Reset your password",

    html: emailLayout({
      settings,
      content,
      previewText: "Follow the instructions to securely reset your password.",
    }),
  };
};

export { forgotPasswordTemplate };
