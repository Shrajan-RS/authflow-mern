import { mailtrapClient, sender } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import ApiError from "../../utils/ApiError.js";

export const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
}) => {
  try {
    if (!name || !email || !verificationToken) {
      throw new ApiError(
        400,
        "Missing Required Fields: Name, Email, Or Verification Token."
      );
    }

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

    console.log(`Email Sent To ${email} Successfully \n`, sendEmail);
  } catch (error) {
    console.error("Failed To Send Email: ", error.message);
    throw new Error(
      `Something Went Wrong While Sending Email to ${name}: `,
      error.message
    );
  }
};
