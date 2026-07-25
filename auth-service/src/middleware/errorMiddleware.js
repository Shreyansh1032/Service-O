import { ZodError } from "zod";

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      errors: err.issues,
    });
  }

  // Mongoose duplicate key (e.g. race condition on unique email)
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Email already registered",
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorMiddleware;