import dotenv from "dotenv";
dotenv.config();

export default {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  BOOKING_SERVICE_URL: process.env.BOOKING_SERVICE_URL,
  INTERNAL_API_KEY: process.env.INTERNAL_API_KEY,
  ALLOW_PAYMENT_SIMULATION: process.env.ALLOW_PAYMENT_SIMULATION === "true",
};