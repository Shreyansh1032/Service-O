import jwt from "jsonwebtoken";
import config from "../config/env.js";

const authMiddleware = (req, res, next) => {
  delete req.headers["x-user-id"];
  delete req.headers["x-user-role"];

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.JWT_SECRET);

    req.headers["x-user-id"] = decoded.id;
    req.headers["x-user-role"] = decoded.role;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;