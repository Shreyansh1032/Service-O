import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import internalUserRoutes from "./routes/internalUserRoutes.js";
import metricsMiddleware from "./middleware/metricsMiddleware.js";
import register from "./utils/metrics.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(metricsMiddleware);

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.get("/health", (req, res) => {
  res.json({ success: true, message: "Auth Service is healthy" });
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,                  // 20 attempts per IP per window
  message: { success: false, message: "Too many attempts, please try again later" },
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

app.use("/api/auth", authRoutes);
app.use("/internal/users", internalUserRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorMiddleware);

export default app;