import express from "express";
import {
  register,
  login,
  profile,
} from "../controllers/authController.js";
import {
  listUsers,
  updateUserRole,
  removeUser,
} from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authMiddleware, profile);


// Admin-only user management
router.get("/users", authMiddleware, adminMiddleware, listUsers);
router.patch("/users/:id/role", authMiddleware, adminMiddleware, updateUserRole);
router.delete("/users/:id", authMiddleware, adminMiddleware, removeUser);

export default router;