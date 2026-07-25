const authMiddleware = (req, res, next) => {
  const userId = req.headers["x-user-id"];
  const userRole = req.headers["x-user-role"];

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: missing user context",
    });
  }

  req.user = { id: userId, role: userRole };
  next();
};

export default authMiddleware;