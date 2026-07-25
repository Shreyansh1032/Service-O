import express from "express";
import internalAuth from "../middleware/internalAuth.js";
import { confirm, cancel } from "../controllers/internalBookingController.js";

const router = express.Router();

router.use(internalAuth);

router.patch("/:id/confirm", confirm);
router.patch("/:id/cancel", cancel);

export default router;