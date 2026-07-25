import axios from "axios";
import config from "../config/env.js";

const seatClient = axios.create({
  baseURL: config.SEAT_SERVICE_URL,
});

export default seatClient;