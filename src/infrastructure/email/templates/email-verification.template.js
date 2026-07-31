export const emailVerificationTemplate = ({ firstName, verificationUrl }) => {
  return {
    subject: "Verify your email address",

    html: `
            <p>Hello ${firstName},</p>

            <p>Thank you for registering with Airse Nursing Agency.</p>

            <p>
                Please click the link below to verify your email address.
            </p>

            <p>
                <a href="${verificationUrl}">
                    Verify Email
                </a>
            </p>

            <p>
                If you did not create this account, you can safely ignore this email.
            </p>
        `,
  };
};
