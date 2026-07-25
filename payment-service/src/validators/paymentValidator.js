import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

export const createPaymentSchema = z.object({
  bookingId: objectId,
  paymentMethod: z.enum(["CARD", "UPI", "NETBANKING", "WALLET"]),
  simulate: z.enum(["SUCCESS", "FAILED"]).optional(),
});