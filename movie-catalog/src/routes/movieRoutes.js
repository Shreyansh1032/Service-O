// src/routes/movieRoutes.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import upload from "../middleware/upload.js";
import {
  create, getAll, getById, update, remove
} from "../controllers/movieController.js";

const router = express.Router();

router.get("/", getAll);
router.get("/:id", getById);

router.post("/", authMiddleware, adminMiddleware, upload.single("poster"), create);
router.put("/:id", authMiddleware, adminMiddleware, upload.single("poster"), update);
router.delete("/:id", authMiddleware, adminMiddleware, remove);

export default router;