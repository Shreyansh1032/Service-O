import crypto from "crypto";
import Payment from "../models/paymentModel.js";
import bookingClient from "../utils/bookingClient.js";
import AppError from "../utils/AppError.js";
import config from "../config/env.js";

export const createPayment = async (data) => {
  // Fetch the real booking — never trust a client-supplied amount
  const bookingRes = await bookingClient.get(`/api/bookings/${data.bookingId}`, {
    headers: { "x-user-id": data.userId, "x-user-role": data.userRole },
  });

  const booking = bookingRes.data.data;

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (booking.userId !== data.userId) {
    throw new AppError("Forbidden: this booking does not belong to you", 403);
  }

  if (booking.bookingStatus !== "PENDING") {
    throw new AppError(`Booking is ${booking.bookingStatus}, cannot pay for it`, 409);
  }

  const payment = await Payment.create({
    bookingId: data.bookingId,
    userId: data.userId,
    amount: booking.totalAmount, // server-determined, not client-supplied
    paymentMethod: data.paymentMethod,
    status: "PENDING",
    transactionId: crypto.randomUUID(),
  });

  // TEMPORARY: simulates a real payment gateway outcome.
  // Must be replaced with a real Razorpay/Stripe webhook flow before this is production-real.
  // Gated behind ALLOW_PAYMENT_SIMULATION so it can't silently work in a real deployment.
  if (!config.ALLOW_PAYMENT_SIMULATION) {
    throw new AppError("Payment simulation is disabled. Integrate a real payment gateway.", 501);
  }

  const outcome = data.simulate === "FAILED" ? "FAILED" : "SUCCESS";

  try {
    if (outcome === "SUCCESS") {
      payment.status = "SUCCESS";
      await payment.save();

      await bookingClient.patch(`/internal/bookings/${data.bookingId}/confirm`);
    } else {
      payment.status = "FAILED";
      await payment.save();

      await bookingClient.patch(`/internal/bookings/${data.bookingId}/cancel`);
    }

    return payment;
  } catch (err) {
    payment.status = "FAILED";
    await payment.save();

    throw new AppError("Payment processed but Booking Service communication failed.", 502);
  }
};

export const refundPayment = async (id, requester) => {
  const payment = await Payment.findById(id);

  if (!payment) throw new AppError("Payment not found", 404);

  if (payment.userId.toString() !== requester.id && requester.role !== "ADMIN") {
    throw new AppError("Forbidden: not your payment", 403);
  }

  if (payment.status !== "SUCCESS") {
    throw new AppError("Only successful payments can be refunded.", 409);
  }

  await bookingClient.patch(`/internal/bookings/${payment.bookingId}/cancel`);

  payment.status = "REFUNDED";
  await payment.save();

  return payment;
};

export const getPaymentById = async (id, requester) => {
  const payment = await Payment.findById(id);

  if (!payment) throw new AppError("Payment not found", 404);

  if (payment.userId.toString() !== requester.id && requester.role !== "ADMIN") {
    throw new AppError("Forbidden: not your payment", 403);
  }

  return payment;
};

export const getAllPayments = async () => {
  return await Payment.find().sort({ createdAt: -1 });
};
