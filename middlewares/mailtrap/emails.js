import { mailtrapClient, sender } from "./mailtrap.config.js";
import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
} from "./emailTemplates.js";
import ApiError from "../../utils/ApiError.js";

export const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
}) => {
  try {
    const recipient = [{ email }];

    const sendEmail = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify Your Email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{userName}", name).replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });

    console.log(
      `verification Email Sent To ${email} Successfully \n`,
      sendEmail
    );
  } catch (error) {
    console.error("Failed To Send Email: ", error.message);
    throw new ApiError(400, "Failed To Send Verification Email");
  }
};

export const welcomeEmail = async ({ name, email }) => {
  try {
    const recipient = [{ email }];

    const sendEmail = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "a842ecc7-fc70-45ac-b5db-070aabb92b35",
      template_variables: {
        name: name,
        company_info_name: "AuthFlow",
      },
    });

    console.log(`Welcome Email Sent To ${email} Successfully \n`, sendEmail);
  } catch (error) {
    console.error("Failed To Send Email: ", error.message);
    throw new ApiError(400, "Failed To Send Welcome Email");
  }
};

export const sendResetPasswordEmail = async (name, email, resetURL) => {
  try {
    const recipient = [{ email }];

    const sendEmail = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset Your Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{userName}", name).replace(
        "{resetURL}",
        resetURL
      ),
      category: "Reset Email",
    });
  } catch (error) {
    console.log(`Failed To Sent Reset Email To ${email}`);
    throw new ApiError(400, "Failed To Send Password Reset Email");
  }
};
