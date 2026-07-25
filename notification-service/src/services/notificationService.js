import Notification from "../models/notificationModel.js";
import authClient from "../utils/authClient.js";
import { sendEmail } from "../utils/sesClient.js";
import AppError from "../utils/AppError.js";

export const sendBookingConfirmedEmail = async (data) => {
  // Look up the user's email via auth-service's internal route
  const userRes = await authClient.get(`/internal/users/${data.userId}`);
  const user = userRes.data.data;

  if (!user) {
    throw new AppError("User not found for notification", 404);
  }

  const subject = "Your booking is confirmed! 🎬";
  const html = `
    <h2>Hi ${user.name},</h2>
    <p>Your booking <strong>${data.bookingId}</strong> has been confirmed.</p>
    <p>Total amount paid: ₹${data.totalAmount}</p>
    <p>Enjoy the show!</p>
  `;

  try {
    await sendEmail({ to: user.email, subject, html });

    await Notification.create({
      userId: data.userId,
      bookingId: data.bookingId,
      type: "BOOKING_CONFIRMED",
      recipientEmail: user.email,
      status: "SENT",
    });
  } catch (err) {
    await Notification.create({
      userId: data.userId,
      bookingId: data.bookingId,
      type: "BOOKING_CONFIRMED",
      recipientEmail: user.email,
      status: "FAILED",
      errorMessage: err.message,
    });

    // Don't throw — a failed email should not surface as an error to booking-service,
    // since the booking itself already succeeded. Just log it for now.
    console.error("Failed to send booking confirmation email:", err.message);
  }
};