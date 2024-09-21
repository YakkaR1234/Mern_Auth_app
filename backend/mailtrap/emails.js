import { mailtrapClient, sender } from "./MailTrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";

// Send Verification Email
export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify Your Email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });

    console.log("Email sent successfully", response);
  } catch (error) {
    console.error("Error sending verification email:", error); // Fixed logging
    throw new Error(`Error sending verification email: ${error}`);
  }
};

// Send Welcome Email
export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "33ec0437-9c9e-4165-8c2d-2c320cd310d4", // Ensure this is correct
      template_variables: {
        company_info_name: "ArizonaX",
      name: name
      },
    });

    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.log("Error sending welcome email:", error); // Consistent logging
    throw new Error(`Error sending welcome email: ${error}`);
  }
};
