import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import {
  createSeat,
  getAllSeats,
  getSeatById,
  updateSeat,
  deleteSeat,
  getSeatsByScreen,
  getSeatDetails,
  lockSeats,
  unlockSeats,
  generateSeats,
  bookSeats,
  releaseSeats,
} from "../controllers/seatController.js";

const router = express.Router();

// Public — anyone browsing seat availability before/during booking
router.get("/", getAllSeats);
router.get("/screen/:screenId", getSeatsByScreen);
router.get("/:id", getSeatById);
router.post("/details", getSeatDetails);

// Logged-in users — the actual seat-selection flow during a booking
router.post("/lock", authMiddleware, lockSeats);
router.post("/unlock", authMiddleware, unlockSeats);
router.post("/book", authMiddleware, bookSeats);
router.post("/release", authMiddleware, releaseSeats);

// Admin-only — seat layout management
router.post("/", authMiddleware, adminMiddleware, createSeat);
router.post("/generate", authMiddleware, adminMiddleware, generateSeats);
router.put("/:id", authMiddleware, adminMiddleware, updateSeat);
router.delete("/:id", authMiddleware, adminMiddleware, deleteSeat);

export default router;