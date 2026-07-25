import express from "express";
import internalAuth from "../middleware/internalAuth.js";
import { getUserContact } from "../controllers/internalUserController.js";

const router = express.Router();
router.use(internalAuth);

router.get("/:id", getUserContact);

export default router;