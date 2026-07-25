import * as bookingService from "../services/bookingService.js";
import { bookingIdSchema } from "../validators/bookingValidator.js";

export const confirm = async (req, res, next) => {
  try {
    const { id } = bookingIdSchema.parse(req.params);
    const booking = await bookingService.confirmBooking(id);
    res.json({ success: true, message: "Booking confirmed successfully", data: booking });
  } catch (err) {
    next(err);
  }
};

export const cancel = async (req, res, next) => {
  try {
    const { id } = bookingIdSchema.parse(req.params);
    const booking = await bookingService.cancelBooking(id);
    res.json({ success: true, message: "Booking cancelled successfully", data: booking });
  } catch (err) {
    next(err);
  }
};