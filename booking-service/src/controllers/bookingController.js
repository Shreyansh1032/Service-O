import * as bookingService from "../services/bookingService.js";
import AppError from "../utils/AppError.js";
import {
  createBookingSchema,
  bookingIdSchema,
  userBookingSchema,
} from "../validators/bookingValidator.js";

const assertOwnerOrAdmin = (booking, req) => {
  if (booking.userId.toString() !== req.user.id && req.user.role !== "ADMIN") {
    throw new AppError("Forbidden: not your booking", 403);
  }
};

export const create = async (req, res, next) => {
  try {
    const data = createBookingSchema.parse(req.body);
    data.userId = req.user.id;
    const booking = await bookingService.createBooking(data);
    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const { id } = bookingIdSchema.parse(req.params);
    const booking = await bookingService.getBookingById(id);
    assertOwnerOrAdmin(booking, req);
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

export const getByUser = async (req, res, next) => {
  try {
    const { userId } = userBookingSchema.parse(req.params);

    if (userId !== req.user.id && req.user.role !== "ADMIN") {
      throw new AppError("Forbidden: cannot view another user's bookings", 403);
    }

    const bookings = await bookingService.getBookingsByUser(userId);
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = bookingIdSchema.parse(req.params);
    const booking = await bookingService.getBookingById(id);
    assertOwnerOrAdmin(booking, req);

    await bookingService.deleteBooking(id);
    res.json({ success: true, message: "Booking deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const cancel = async (req, res, next) => {
  try {
    const { id } = bookingIdSchema.parse(req.params);
    const booking = await bookingService.getBookingById(id);
    assertOwnerOrAdmin(booking, req);

    const cancelled = await bookingService.cancelBooking(id);
    res.json({ success: true, message: "Booking cancelled successfully", data: cancelled });
  } catch (err) {
    next(err);
  }
};