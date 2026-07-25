import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import config from "../config/env.js";

const ses = new SESClient({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  const command = new SendEmailCommand({
    Source: config.SES_FROM_EMAIL,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: { Html: { Data: html } },
    },
  });

  return await ses.send(command);
};