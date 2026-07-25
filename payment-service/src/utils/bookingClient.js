import axios from "axios";
import config from "../config/env.js";

const bookingClient = axios.create({
  baseURL: config.BOOKING_SERVICE_URL,
  timeout: 5000,
  headers: {
    "x-internal-api-key": config.INTERNAL_API_KEY,
  },
});

export default bookingClient;