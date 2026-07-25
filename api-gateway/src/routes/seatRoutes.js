import express from "express";
import optionalAuthMiddleware from "../middleware/optionalAuthMiddleware.js";
import seatProxy from "../proxies/seatProxy.js";

const router = express.Router();
router.use("/", optionalAuthMiddleware, seatProxy);

export default router;