import { z } from "zod";

export const showSchema = z.object({
    movie: z.string(),

    theatre: z.string(),

    screen: z.string(),

    showDate: z.string(),

    startTime: z.string(),

    endTime: z.string(),

    price: z.number().positive()
});