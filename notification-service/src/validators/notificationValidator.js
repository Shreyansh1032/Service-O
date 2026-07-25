import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const bookingConfirmedSchema = z.object({
  userId: objectId,
  bookingId: objectId,
  totalAmount: z.number().positive(),
});