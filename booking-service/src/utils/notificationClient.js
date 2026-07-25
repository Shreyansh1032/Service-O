import axios from "axios";
import config from "../config/env.js";

const notificationClient = axios.create({
  baseURL: config.NOTIFICATION_SERVICE_URL,
  timeout: 3000,
  headers: {
    "x-internal-api-key": config.INTERNAL_API_KEY,
  },
});

export const notifyBookingConfirmed = async (booking) => {
  try {
    await notificationClient.post("/api/notifications/booking-confirmed", {
      userId: booking.userId,
      bookingId: booking._id,
      totalAmount: booking.totalAmount,
    });
  } catch (err) {
    console.error("Notification service unreachable:", err.message);
  }
};

export default notificationClient;