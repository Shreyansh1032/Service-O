import dotenv from "dotenv";
dotenv.config();

const required = [
  "PORT", "MONGO_URI", "AWS_REGION", "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY", "SES_FROM_EMAIL", "AUTH_SERVICE_URL", "INTERNAL_API_KEY",
];

const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`Missing required env vars: ${missing.join(", ")}`);
  process.exit(1);
}

export default {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  AWS_REGION: process.env.AWS_REGION,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  SES_FROM_EMAIL: process.env.SES_FROM_EMAIL,
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL,
  INTERNAL_API_KEY: process.env.INTERNAL_API_KEY,
};