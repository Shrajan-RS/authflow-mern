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

    console.log(
      `verification Email Sent To ${email} Successfully \n`,
      sendEmail
    );
  } catch (error) {
    console.error("Failed To Send Email: ", error.message);
    throw new Error(
      `Something Went Wrong While Sending Email to ${name}: `,
      error.message
    );
  }
};

export const welcomeEmail = async ({ name, email }) => {
  try {
    if (!name || !email) {
      throw new ApiError(400, "Missing Required Fields: Name Or Email");
    }

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
    throw new Error(
      `Something Went Wrong While Sending Email to ${name}: `,
      error.message
    );
  }
};
