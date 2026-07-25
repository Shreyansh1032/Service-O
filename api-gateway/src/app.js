import express from "express";
import cors from "cors";
import helmet from "helmet";

import requestId from "./middleware/requestId.js";
import logger from "./middleware/logger.js";
import rateLimiter from "./middleware/rateLimiter.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import metricsMiddleware from "./middleware/metricsMiddleware.js";
import register from "./utils/metrics.js";

import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import showRoutes from "./routes/showRoutes.js";
import theatreRoutes from "./routes/theatreRoutes.js";
import screenRoutes from "./routes/screenRoutes.js";
import seatRoutes from "./routes/seatRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(requestId);
app.use(logger);
app.use(rateLimiter);
app.use(metricsMiddleware); 

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});


app.get("/health", (req, res) => {
  res.json({ success: true, message: "API Gateway is healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/theatres", theatreRoutes);
app.use("/api/screens", screenRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorMiddleware);

export default app;