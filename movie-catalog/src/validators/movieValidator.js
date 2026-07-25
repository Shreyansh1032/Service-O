// src/validators/movieValidator.js
import { z } from "zod";

export const movieSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(10, "Description is required"),
  duration: z.coerce.number().positive(),
  genre: z.array(z.string()).min(1),
  language: z.array(z.string()).min(1),
  releaseDate: z.string(),
  trailer: z.string().optional(),
  rating: z.coerce.number().min(0).max(10).optional(),
  active: z.coerce.boolean().optional(),
  // poster is NOT here — it's set server-side from the uploaded file, never from client input
});