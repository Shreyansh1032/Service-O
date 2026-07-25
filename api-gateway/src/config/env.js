import dotenv from "dotenv";

dotenv.config();

const required = [
  "PORT",
  "JWT_SECRET",
  "AUTH_SERVICE",
  "MOVIE_SERVICE",
  "SEAT_SERVICE",
  "BOOKING_SERVICE",
  "PAYMENT_SERVICE",
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing required env vars: ${missing.join(", ")}`);
  process.exit(1);
}

export default {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,

  AUTH_SERVICE: process.env.AUTH_SERVICE,
  MOVIE_SERVICE: process.env.MOVIE_SERVICE,
  SEAT_SERVICE: process.env.SEAT_SERVICE,
  BOOKING_SERVICE: process.env.BOOKING_SERVICE,
  PAYMENT_SERVICE: process.env.PAYMENT_SERVICE,
};