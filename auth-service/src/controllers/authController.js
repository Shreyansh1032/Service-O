import {
    registerSchema,
    loginSchema
} from "../validators/authValidator.js";

import {
    registerUser,
    loginUser,
    getProfile
} from "../services/authService.js";

export const register = async (req, res, next) => {

    try {

        const data = registerSchema.parse(req.body);

        const result = await registerUser(data);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result
        });

    } catch (err) {
        next(err);
    }

};

export const login = async (req, res, next) => {

    try {

        const data = loginSchema.parse(req.body);

        const result = await loginUser(data);

        res.json({
            success: true,
            message: "Login successful",
            data: result
        });

    } catch (err) {
        next(err);
    }

};

export const profile = async (req, res, next) => {

    try {

        const user = await getProfile(req.user.id);

        res.json({
            success: true,
            data: user
        });

    } catch (err) {
        next(err);
    }

};