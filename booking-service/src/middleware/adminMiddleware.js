const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: admin access required",
    });
  }
  next();
};
export default adminMiddleware;