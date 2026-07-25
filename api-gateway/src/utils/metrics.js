import client from "prom-client";

const register = new client.Registry();

// Default Node.js metrics: memory, CPU, event loop lag, GC — free, no setup
client.collectDefaultMetrics({ register });

// Custom metric: how many requests, split by method/route/status
export const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

// Custom metric: how long requests take, as a distribution
export const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

export default register;