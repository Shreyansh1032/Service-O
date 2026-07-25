import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import paymentProxy from "../proxies/paymentProxy.js";

const router = express.Router();
router.use("/", authMiddleware, paymentProxy);

export default router;