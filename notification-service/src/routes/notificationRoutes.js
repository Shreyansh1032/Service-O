import express from "express";
import internalAuth from "../middleware/internalAuth.js";
import { bookingConfirmed } from "../controllers/notificationController.js";

const router = express.Router();
router.use(internalAuth);

router.post("/booking-confirmed", bookingConfirmed);

export default router;