import dotenv from "dotenv";
dotenv.config();

export default {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  SEAT_SERVICE_URL: process.env.SEAT_SERVICE_URL,
  NOTIFICATION_SERVICE_URL: process.env.NOTIFICATION_SERVICE_URL,
  INTERNAL_API_KEY: process.env.INTERNAL_API_KEY,
};