import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import AppError from "../utils/AppError.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

export const registerUser = async (data) => {
  const { name, email, password } = data;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // role is deliberately never taken from client input — always USER on public register
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateToken({ id: user._id, role: user.role });

  return { user: sanitizeUser(user), token };
};

export const loginUser = async (data) => {
  const { email, password } = data;

  // must explicitly select password since model now excludes it by default (see model changes below)
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = generateToken({ id: user._id, role: user.role });

  return { user: sanitizeUser(user), token };
};

export const getProfile = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return sanitizeUser(user);
};

/* =========================
   Admin-only
========================= */

export const getAllUsers = async () => {
  return await User.find().sort({ createdAt: -1 });
};

export const changeUserRole = async (id, role) => {
  const user = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return sanitizeUser(user);
};

export const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return sanitizeUser(user);
};