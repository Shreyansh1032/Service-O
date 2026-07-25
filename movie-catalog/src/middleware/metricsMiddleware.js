import { httpRequestsTotal, httpRequestDuration } from "../utils/metrics.js";

const metricsMiddleware = (req, res, next) => {
  const start = process.hrtime();

  res.on("finish", () => {
    // Use req.route?.path when available so /api/movies/:id doesn't create
    // a separate metric series per unique ID — keeps cardinality sane.
    const route = req.route?.path || req.path;
    const labels = {
      method: req.method,
      route,
      status_code: res.statusCode,
    };

    httpRequestsTotal.inc(labels);

    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds + nanoseconds / 1e9;
    httpRequestDuration.observe(labels, duration);
  });

  next();
};

export default metricsMiddleware;