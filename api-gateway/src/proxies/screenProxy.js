import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import config from "../config/env.js";

export default createProxyMiddleware({
  target: config.MOVIE_SERVICE,
  changeOrigin: true,
  pathRewrite: (path) => "/api/screens" + path,
  on: { proxyReq: fixRequestBody },
});