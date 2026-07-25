import jwt from "jsonwebtoken";
import config from "../config/env.js";

const optionalAuthMiddleware = (req, res, next) => {
  // Always strip client-supplied identity headers first — never trust these directly,
  // regardless of whether a token is present. This is what closes the spoofing gap.
  delete req.headers["x-user-id"];
  delete req.headers["x-user-role"];

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // No token supplied — proceed anonymously. Fine for public GET routes;
    // any write attempt downstream will 401 since there's no x-user-id header now.
    return next();
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.JWT_SECRET);

    req.headers["x-user-id"] = decoded.id;
    req.headers["x-user-role"] = decoded.role;
  } catch (err) {
    // A token was supplied but it's invalid/expired — reject rather than silently
    // falling back to anonymous, since this is more likely tampering or a bug than intent.
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  next();
};

export default optionalAuthMiddleware;