import { z } from "zod";

const objectId = z.string().regex(
    /^[0-9a-fA-F]{24}$/,
    "Invalid MongoDB ObjectId"
);

export const createSeatSchema = z.object({
    screenId: objectId,

    seatNumber: z
        .string()
        .trim()
        .min(1)
        .max(5),

    row: z
        .string()
        .trim()
        .min(1)
        .max(2),

    type: z.enum([
        "REGULAR",
        "PREMIUM",
        "RECLINER",
    ]),

    price: z
        .number()
        .positive()
        .max(10000),
});

export const updateSeatSchema =
    createSeatSchema.partial();

export const seatDetailsSchema = z.object({
    seatIds: z.array(objectId).min(1),
});

export const seatActionSchema = z.object({
  seatIds: z.array(objectId).min(1),
  bookingId: objectId.optional(),
});

export const generateSeatsSchema = z.object({

    screenId: objectId,

    rows: z
        .number()
        .min(1)
        .max(26),

    columns: z
        .number()
        .min(1)
        .max(50)

});