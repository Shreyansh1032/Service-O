// bookingProxy.js
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import config from "../config/env.js";

export default createProxyMiddleware({
  target: config.BOOKING_SERVICE,
  changeOrigin: true,
  pathRewrite: (path) => "/api/bookings" + path,
  on: { proxyReq: fixRequestBody },
});