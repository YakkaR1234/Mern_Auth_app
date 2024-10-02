import { mailtrapClient, sender } from "./MailTrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE,PASSWORD_RESET_REQUEST_TEMPLATE,PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplates.js";

// Send Verification Email
export const sendVerificationEmail = async (email, verificationToken) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Verify your email",
			html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
			category: "Email Verification",
		});

		console.log("Email sent successfully", response);
	} catch (error) {
		console.error(`Error sending verification`, error);

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

export const sendPassowordRestEmail=async(email,resetURL)=>{
  const recipient=[{email}];
  try {
    const response=await mailtrapClient.send({
      from:sender,
      to:recipient,
      subject:"Reset ypur Password",
      html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL),
      category:"Passowrd Reset",
    })
  } catch (error) {
    console.error(`Error sending password reset email`,error);
    throw new Error(`Error sending password reset email: ${error}`);
  }
}


export const sendResetSuccessEmail=async(email)=>{
  const recipient=[{email}];

  try {
    const response=await mailtrapClient.send({
      from:sender,
      to:recipient,
      subject:"passowrd reset successfully",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category:"Passowrd Reset",
    })
    console.log("Password Reset Email Sent Successfully",response)
  } catch (error) {
    console.error(`Error sending password reset email`,error);
    throw new Error(`Error sending password reset success email: ${error}`);
  }
}

