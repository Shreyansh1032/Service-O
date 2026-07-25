import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import notificationRoutes from "./routes/notificationRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
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
  res.json({ success: true, message: "Notification Service is healthy" });
});

app.use("/api/notifications", notificationRoutes);

app.use(errorMiddleware);

export default app;