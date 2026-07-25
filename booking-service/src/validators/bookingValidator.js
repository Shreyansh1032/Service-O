import { z } from "zod";

const objectId = z.string().regex(
    /^[0-9a-fA-F]{24}$/,
    "Invalid ObjectId"
);

export const createBookingSchema = z.object({
    showId: objectId,
    seatIds: z.array(objectId).min(1,"Select at least one seat"),
});

export const updateBookingSchema = z.object({
    bookingStatus: z
        .enum([
            "PENDING",
            "CONFIRMED",
            "CANCELLED",
            "EXPIRED",
        ])
        .optional(),

    paymentStatus: z
        .enum([
            "PENDING",
            "SUCCESS",
            "FAILED",
            "REFUNDED",
        ])
        .optional(),
});

export const bookingIdSchema = z.object({
  id: objectId,
});

export const userBookingSchema = z.object({
  userId: objectId,
});