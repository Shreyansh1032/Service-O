import express from "express";
import optionalAuthMiddleware from "../middleware/optionalAuthMiddleware.js";
import showProxy from "../proxies/showProxy.js";

const router = express.Router();
router.use("/", optionalAuthMiddleware, showProxy);

export default router;