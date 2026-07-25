import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import connectDB from "../config/db.js";
import User from "../models/user.model.js";

const seedAdmin = async () => {
  await connectDB();

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before seeding.");
    process.exit(1);
  }

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Admin already exists:", email);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name: "Admin",
    email,
    password: hashedPassword,
    role: "ADMIN",
  });

  console.log("Admin user created:", email);
  process.exit(0);
};

seedAdmin();