const emailLayout = ({ settings, content, previewText = "" }) => {
  const {
    organisationName,
    siteName,
    websiteUrl,
    organisationEmail,
    recruitmentEmail,
    telephone,
    address,
    country,
    postcode,
    logoUrl,
  } = settings;

  const escapeHtml = (value = "") =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const safeUrl = (value) => {
    if (!value) return null;

    try {
      const url = new URL(value);

      return ["http:", "https:"].includes(url.protocol) ? url.href : null;
    } catch {
      return null;
    }
  };

  const safeLogoUrl = safeUrl(logoUrl);
  const safeWebsiteUrl = safeUrl(websiteUrl);

  const contactEmail = recruitmentEmail || organisationEmail;

  const addressParts = [address, postcode, country].filter(Boolean);

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />

        <title>${escapeHtml(siteName)}</title>

        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #f1f5f9;
            font-family: Arial, Helvetica, sans-serif;
            color: #334155;
            -webkit-font-smoothing: antialiased;
          }

          table {
            border-spacing: 0;
            border-collapse: collapse;
          }

          img {
            border: 0;
            display: block;
          }

          .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
          }

          .email-content {
            padding: 40px 36px;
            font-size: 15px;
            line-height: 1.7;
            color: #334155;
          }

          .email-footer {
            background: #f0f6ff;
            padding: 28px 36px;
            text-align: center;
          }

          .email-footer a {
            color: #2563eb;
            text-decoration: none;
          }

          .email-footer-text {
            font-size: 12px;
            line-height: 1.7;
            color: #64748b;
          }

          @media only screen and (max-width: 600px) {
            .email-content {
              padding: 28px 22px !important;
            }

            .email-footer {
              padding: 24px 20px !important;
            }
          }
        </style>
      </head>

      <body>
        <div style="display:none;font-size:1px;color:#f1f5f9;max-height:0;max-width:0;opacity:0;overflow:hidden;">
          ${escapeHtml(previewText)}
        </div>

        <table role="presentation" width="100%" bgcolor="#f1f5f9">
          <tr>
            <td align="center" style="padding: 30px 12px;">

              <table
                role="presentation"
                width="100%"
                class="email-container"
                style="max-width:600px;border-radius:10px;overflow:hidden;"
              >

                <!-- Header -->
                <tr>
                  <td
                    align="center"
                    bgcolor="#ffffff"
                    style="padding:28px 24px;border-bottom:3px solid #2563eb;"
                  >
                    ${
                      safeLogoUrl
                        ? `
                          <img
                            src="${escapeHtml(safeLogoUrl)}"
                            alt="${escapeHtml(organisationName)}"
                            width="150"
                            style="max-width:150px;max-height:65px;width:auto;height:auto;margin:0 auto 10px;"
                          />
                        `
                        : ""
                    }

                    <p style="margin:0;font-size:19px;font-weight:700;color:#1e3a5f;">
                      ${escapeHtml(organisationName)}
                    </p>

                    <p style="margin:5px 0 0;font-size:12px;color:#64748b;">
                      ${escapeHtml(siteName)}
                    </p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td class="email-content">
                    ${content}
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td class="email-footer">

                    <p style="margin:0 0 12px;font-size:15px;font-weight:700;color:#1e3a5f;">
                      ${escapeHtml(organisationName)}
                    </p>

                    ${
                      addressParts.length
                        ? `
                          <p class="email-footer-text" style="margin:0 0 8px;">
                            ${escapeHtml(addressParts.join(", "))}
                          </p>
                        `
                        : ""
                    }

                    ${
                      contactEmail
                        ? `
                          <p class="email-footer-text" style="margin:5px 0;">
                            <a href="mailto:${escapeHtml(contactEmail)}">
                              ${escapeHtml(contactEmail)}
                            </a>
                          </p>
                        `
                        : ""
                    }

                    ${
                      telephone
                        ? `
                          <p class="email-footer-text" style="margin:5px 0;">
                            ${escapeHtml(telephone)}
                          </p>
                        `
                        : ""
                    }

                    ${
                      safeWebsiteUrl
                        ? `
                          <p class="email-footer-text" style="margin:5px 0;">
                            <a href="${escapeHtml(safeWebsiteUrl)}">
                              ${escapeHtml(websiteUrl)}
                            </a>
                          </p>
                        `
                        : ""
                    }

                    <div style="border-top:1px solid #dbe5f1;margin:20px 0 14px;"></div>

                    <p class="email-footer-text" style="margin:0;">
                      This is an automated email from ${escapeHtml(siteName)}.
                      Please do not reply directly to this message.
                    </p>

                    <p class="email-footer-text" style="margin:10px 0 0;">
                      &copy; ${new Date().getFullYear()}
                      ${escapeHtml(organisationName)}.
                      All rights reserved.
                    </p>

                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

export { emailLayout };
