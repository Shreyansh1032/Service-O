import { ZodError } from "zod";

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ success: false, errors: err.issues });
  }
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: "Duplicate entry" });
  }
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorMiddleware;