import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";

export const getUserContact = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json({
      success: true,
      data: { name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};