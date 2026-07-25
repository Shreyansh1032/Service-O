import Booking from "../models/bookingModel.js";
import seatClient from "../utils/seatClient.js";
import calculateAmount from "../utils/calculateAmount.js";
import AppError from "../utils/AppError.js";
import { notifyBookingConfirmed } from "../utils/notificationClient.js";

export const createBooking = async (data) => {
  const response = await seatClient.post("/api/seats/details", { seatIds: data.seatIds });
  const seats = response.data.data;

  if (seats.length !== data.seatIds.length) {
    throw new AppError("Some seats not found", 404);
  }

  const unavailableSeats = seats.filter((s) => s.status !== "AVAILABLE");
  if (unavailableSeats.length > 0) {
    throw new AppError(
      `Seats unavailable: ${unavailableSeats.map((s) => s.seatNumber).join(", ")}`,
      409
    );
  }

  const totalAmount = calculateAmount(seats);

  const booking = await Booking.create({
    userId: data.userId,
    showId: data.showId,
    seatIds: data.seatIds,
    seatSnapshot: seats.map((s) => ({
      seatId: s._id, seatNumber: s.seatNumber, row: s.row, type: s.type, price: s.price,
    })),
    totalAmount,
    bookingStatus: "PENDING",
    paymentStatus: "PENDING",
  });

  const lockResponse = await seatClient.post(
    "/api/seats/lock",
    { seatIds: data.seatIds, bookingId: booking._id.toString() },
    { headers: { "x-user-id": data.userId } }
  );

  if (!lockResponse.data.success) {
    await booking.deleteOne();
    throw new AppError("Seats were just taken by another user, please retry", 409);
  }

  return booking;
};

export const confirmBooking = async (id) => {
  const booking = await Booking.findById(id);

  if (!booking) throw new AppError("Booking not found", 404);
  if (booking.bookingStatus === "CONFIRMED") throw new AppError("Booking already confirmed", 409);
  if (booking.bookingStatus === "CANCELLED") throw new AppError("Cancelled booking cannot be confirmed", 409);
  if (booking.bookingStatus === "EXPIRED") throw new AppError("Booking has expired", 409);

  await seatClient.post(
    "/api/seats/book",
    { seatIds: booking.seatIds },
    { headers: { "x-user-id": booking.userId.toString() } }
  );

  booking.bookingStatus = "CONFIRMED";
  booking.paymentStatus = "SUCCESS";
  await booking.save();

  await notifyBookingConfirmed(booking);

  return booking;
};

export const cancelBooking = async (id) => {
  const booking = await Booking.findById(id);

  if (!booking) throw new AppError("Booking not found", 404);
  if (booking.bookingStatus === "CANCELLED") throw new AppError("Booking already cancelled", 409);
  if (booking.bookingStatus === "EXPIRED") throw new AppError("Booking already expired", 409);

  const userIdHeader = { headers: { "x-user-id": booking.userId.toString() } };

  if (booking.bookingStatus === "PENDING") {
    await seatClient.post("/api/seats/unlock", { seatIds: booking.seatIds }, userIdHeader);
    booking.paymentStatus = "FAILED";
  }

  if (booking.bookingStatus === "CONFIRMED") {
    await seatClient.post("/api/seats/release", { seatIds: booking.seatIds }, userIdHeader);
    booking.paymentStatus = "REFUNDED";
  }

  booking.bookingStatus = "CANCELLED";
  await booking.save();

  return booking;
};

export const getAllBookings = async () => {
  return await Booking.find().sort({ createdAt: -1 });
};

export const getBookingById = async (id) => {
  const booking = await Booking.findById(id);
  if (!booking) throw new AppError("Booking not found", 404);
  return booking;
};

export const getBookingsByUser = async (userId) => {
  return await Booking.find({ userId }).sort({ createdAt: -1 });
};

export const deleteBooking = async (id) => {
  const booking = await Booking.findById(id);
  if (!booking) throw new AppError("Booking not found", 404);
  if (booking.bookingStatus === "CONFIRMED") {
    throw new AppError("Confirmed booking cannot be deleted", 409);
  }
  await booking.deleteOne();
  return booking;
};