export const forgotPasswordTemplate = ({ firstName, forgotPasswordUrl }) => {
  return {
    subject: "Reset your password",

    html: `
            <p>Hello ${firstName},</p>

            <p>Thank you for registering with Airse Nursing Agency.</p>

            <p>
                Please click the link below to reset your password.
            </p>

            <p>
                <a href="${forgotPasswordUrl}">
                    Reset Password
                </a>
            </p>

            <p>
                If you did not make this request, you can safely ignore this email.
            </p>
        `,
  };
};
