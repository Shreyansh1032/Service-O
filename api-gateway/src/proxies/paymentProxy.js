import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import config from "../config/env.js";

export default createProxyMiddleware({
  target: config.PAYMENT_SERVICE,
  changeOrigin: true,
  pathRewrite: (path) => "/api/payments" + path,
  on: { proxyReq: fixRequestBody },
  logLevel: "debug",
});