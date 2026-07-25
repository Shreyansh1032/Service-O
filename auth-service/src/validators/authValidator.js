import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters").max(50),
  email: z.string().trim().toLowerCase().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(72, "Password too long"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const roleUpdateSchema = z.object({
  role: z.enum(["USER", "ADMIN"]),
});