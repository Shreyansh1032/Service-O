import app from "./app.js";
import config from "./config/env.js";

const server = app.listen(config.PORT, () => {
  console.log(`API Gateway running on ${config.PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  server.close(() => process.exit(1));
});