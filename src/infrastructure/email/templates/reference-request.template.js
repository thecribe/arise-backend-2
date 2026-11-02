import { emailLayout } from "../email-layout.js";

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const referenceRequestTemplate = ({
  refereeName,
  applicantName,
  referenceUrl,
  settings,
}) => {
  const content = `
    <h2 style="
      margin: 0 0 20px;
      font-size: 23px;
      color: #1e3a5f;
      font-weight: 700;
    ">
      Professional Reference Request
    </h2>

    <p>Hello ${escapeHtml(refereeName)},</p>

    <p>
      ${escapeHtml(settings.organisationName)} is currently
      processing a recruitment application from
      <strong>${escapeHtml(applicantName)}</strong>, who has
      provided your details as a professional referee.
    </p>

    <p>
      We would appreciate your assistance in providing a
      professional reference to help us assess their
      suitability for a position within our organisation.
    </p>

    <p>
      Please use the button below to access and complete
      our online reference form.
    </p>

    <div style="text-align:center;margin:32px 0;">
      <a
        href="${escapeHtml(referenceUrl)}"
        style="
          display:inline-block;
          padding:14px 30px;
          background-color:#2563eb;
          color:#ffffff;
          text-decoration:none;
          border-radius:6px;
          font-size:14px;
          font-weight:600;
        "
      >
        Complete Reference Form
      </a>
    </div>

    <p style="font-size:13px;color:#64748b;">
      If the button above doesn't work, you can copy and
      paste the following link into your browser:
    </p>

    <p style="font-size:13px;word-break:break-all;">
      <a
        href="${escapeHtml(referenceUrl)}"
        style="color:#2563eb;"
      >
        ${escapeHtml(referenceUrl)}
      </a>
    </p>

    <div style="
      background-color:#eff6ff;
      border-left:3px solid #2563eb;
      padding:14px 16px;
      margin:24px 0;
    ">
      <p style="margin:0;font-size:13px;color:#1e40af;">
        <strong>Important:</strong>
        This reference request is confidential.
        Please complete the form personally and provide
        accurate information based on your professional
        experience with the applicant.
      </p>
    </div>

    <p>
      If you have any questions or did not expect this
      request, please contact our recruitment team.
    </p>

    <p style="margin-top:28px;">
      Kind regards,<br />
      <strong>${escapeHtml(settings.organisationName)} Recruitment Team</strong>
    </p>
  `;

  return {
    subject: `Professional Reference Request for ${applicantName}`,

    html: emailLayout({
      settings,
      content,
      previewText: `${applicantName} has nominated you as a professional referee. Please complete our reference form.`,
    }),
  };
};

export { referenceRequestTemplate };
