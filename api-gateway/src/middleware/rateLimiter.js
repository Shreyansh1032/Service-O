import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 300,                 // requests per IP per window across the whole gateway
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});

export default rateLimiter;