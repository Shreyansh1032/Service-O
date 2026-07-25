import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authProxy from "../proxies/authProxy.js";

const router = express.Router();

// Public
router.post("/register", authProxy);
router.post("/login", authProxy);

// Everything else requires a valid token
router.use(authMiddleware);
router.use("/", authProxy);

export default router;