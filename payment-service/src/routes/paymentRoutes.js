import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { create, getAll, getById, refund } from "../controllers/paymentController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", create);
router.get("/:id", getById);
router.patch("/:id/refund", refund);

router.get("/", adminMiddleware, getAll);

export default router;