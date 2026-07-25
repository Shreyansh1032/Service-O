import { screenSchema } from "../validators/screenValidator.js";

import {
    createScreen,
    getAllScreens,
    getScreenById,
    updateScreen,
    deleteScreen,
    getScreensByTheatre
} from "../services/screenService.js";

export const create = async (req, res, next) => {
    try {

        const data = screenSchema.parse(req.body);

        const screen = await createScreen(data);

        res.status(201).json({
            success: true,
            data: screen
        });

    } catch (err) {
        next(err);
    }
};

export const getAll = async (req, res, next) => {
    try {

        const screens = await getAllScreens();

        res.json({
            success: true,
            data: screens
        });

    } catch (err) {
        next(err);
    }
};

export const getById = async (req, res, next) => {
    try {

        const screen = await getScreenById(req.params.id);

        res.json({
            success: true,
            data: screen
        });

    } catch (err) {
        next(err);
    }
};

export const getByTheatre = async (req, res, next) => {
    try {

        const screens = await getScreensByTheatre(req.params.theatreId);

        res.json({
            success: true,
            data: screens
        });

    } catch (err) {
        next(err);
    }
};

export const update = async (req, res, next) => {
    try {

        const screen = await updateScreen(req.params.id, req.body);

        res.json({
            success: true,
            data: screen
        });

    } catch (err) {
        next(err);
    }
};

export const remove = async (req, res, next) => {
    try {

        await deleteScreen(req.params.id);

        res.json({
            success: true,
            message: "Screen deleted successfully"
        });

    } catch (err) {
        next(err);
    }
};