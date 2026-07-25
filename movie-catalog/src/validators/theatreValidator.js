import { z } from "zod";

export const theatreSchema = z.object({
    name: z.string().min(2),
    city: z.string().min(2),
    address: z.string().min(5),
    totalScreens: z.number().positive(),
    active: z.boolean().optional()
});