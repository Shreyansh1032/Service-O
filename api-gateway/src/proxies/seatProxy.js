import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import config from "../config/env.js";

export default createProxyMiddleware({
  target: config.SEAT_SERVICE,
  changeOrigin: true,
  pathRewrite: (path) => "/api/seats" + path,
  on: { proxyReq: fixRequestBody },
  logLevel: "debug",
});