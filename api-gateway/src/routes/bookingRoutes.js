import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import bookingProxy from "../proxies/bookingProxy.js";

const router = express.Router();
router.use("/", authMiddleware, bookingProxy);

export default router;