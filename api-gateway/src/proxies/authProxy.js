// authProxy.js
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import config from "../config/env.js";

export default createProxyMiddleware({
  target: config.AUTH_SERVICE,
  changeOrigin: true,
  pathRewrite: (path) => "/api/auth" + path,
  on: { proxyReq: fixRequestBody },
});