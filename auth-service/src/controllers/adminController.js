import {
  getAllUsers,
  changeUserRole,
  deleteUser,
} from "../services/authService.js";
import { roleUpdateSchema } from "../validators/authValidator.js";

export const listUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    next(err);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = roleUpdateSchema.parse(req.body);
    const user = await changeUserRole(req.params.id, role);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const removeUser = async (req, res, next) => {
  try {
    await deleteUser(req.params.id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};