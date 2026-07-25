import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
  create, getAll, getById, getByUser, remove, cancel,
} from "../controllers/bookingController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", create);
router.get("/user/:userId", getByUser);
router.get("/:id", getById);
router.delete("/:id", remove);
router.patch("/:id/cancel", cancel);

router.get("/", adminMiddleware, getAll);

export default router;