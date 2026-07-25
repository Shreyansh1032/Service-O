import { bookingConfirmedSchema } from "../validators/notificationValidator.js";
import { sendBookingConfirmedEmail } from "../services/notificationService.js";

export const bookingConfirmed = async (req, res, next) => {
  try {
    const data = bookingConfirmedSchema.parse(req.body);
    await sendBookingConfirmedEmail(data);

    res.json({ success: true, message: "Notification processed" });
  } catch (err) {
    next(err);
  }
};