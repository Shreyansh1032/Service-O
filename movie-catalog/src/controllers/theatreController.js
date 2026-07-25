import { theatreSchema } from "../validators/theatreValidator.js";

import {
    createTheatre,
    getAllTheatres,
    getTheatreById,
    updateTheatre,
    deleteTheatre,
} from "../services/theatreService.js";

export const create = async (req, res, next) => {
    try {
        const data = theatreSchema.parse(req.body);

        const theatre = await createTheatre(data);

        res.status(201).json({
            success: true,
            data: theatre,
        });
    } catch (err) {
        next(err);
    }
};

export const getAll = async (req, res, next) => {
    try {
        const theatres = await getAllTheatres();

        res.json({
            success: true,
            data: theatres,
        });
    } catch (err) {
        next(err);
    }
};

export const getById = async (req, res, next) => {
    try {
        const theatre = await getTheatreById(req.params.id);

        res.json({
            success: true,
            data: theatre,
        });
    } catch (err) {
        next(err);
    }
};

export const update = async (req, res, next) => {
    try {
        const theatre = await updateTheatre(req.params.id, req.body);

        res.json({
            success: true,
            data: theatre,
        });
    } catch (err) {
        next(err);
    }
};

export const remove = async (req, res, next) => {
    try {
        await deleteTheatre(req.params.id);

        res.json({
            success: true,
            message: "Theatre deleted successfully",
        });
    } catch (err) {
        next(err);
    }
};