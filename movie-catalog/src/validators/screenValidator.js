import { z } from "zod";

export const screenSchema = z.object({
    theatre: z.string(),

    screenNumber: z.number().positive(),

    screenName: z.string().optional(),

    totalRows: z.number().positive(),

    seatsPerRow: z.number().positive()
});