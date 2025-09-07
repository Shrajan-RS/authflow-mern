import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.MAIL_TRAP_TOKEN || "746be339151403acc774c4a01198c97c";

const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});

const sender = {
  email: "authflow@demomailtrap.co",
  name: "AuthFlow",
};

export { mailtrapClient, sender };
