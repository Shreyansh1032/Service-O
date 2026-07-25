import cron from "node-cron";
import Booking from "../models/bookingModel.js";

export const startBookingExpiryJob = () => {
  cron.schedule("*/1 * * * *", async () => {
    const result = await Booking.updateMany(
      { bookingStatus: "PENDING", expiresAt: { $lt: new Date() } },
      { bookingStatus: "EXPIRED", paymentStatus: "FAILED" }
    );

    if (result.modifiedCount > 0) {
      console.log(`Expired ${result.modifiedCount} stale bookings`);
    }
  });
};