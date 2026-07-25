import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import metricsMiddleware from "./middleware/metricsMiddleware.js";
import register from "./utils/metrics.js";

import movieRoutes from "./routes/movieRoutes.js";
import theatreRoutes from "./routes/theatreRoutes.js";
import screenRoutes from "./routes/screenRoutes.js";
import showRoutes from "./routes/showRoutes.js";

import errorMiddleware from "./middleware/errorMiddleware.js";

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
  res.json({ success: true, message: "Movie Catalog Service is healthy" });
});

app.use("/api/movies", movieRoutes);
app.use("/api/theatres", theatreRoutes);
app.use("/api/screens", screenRoutes);
app.use("/api/shows", showRoutes);

app.use(errorMiddleware);

export default app;