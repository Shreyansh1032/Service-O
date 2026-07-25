import * as showService from "../services/showService.js";
import { showSchema } from "../validators/showValidator.js";

export const createShow = async (req, res, next) => {
    try {
        const data = showSchema.parse(req.body);

        const show = await showService.createShow(data);

        res.status(201).json({
            success: true,
            data: show,
        });
    } catch (err) {
        next(err);
    }
};

export const getAllShows = async (req, res, next) => {
    try {
        const shows = await showService.getAllShows();

        res.json({
            success: true,
            data: shows,
        });
    } catch (err) {
        next(err);
    }
};

export const getShowById = async (req, res, next) => {
    try {
        const show = await showService.getShowById(req.params.id);

        res.json({
            success: true,
            data: show,
        });
    } catch (err) {
        next(err);
    }
};

export const getShowsByMovie = async (req, res, next) => {
    try {
        const shows = await showService.getShowsByMovie(req.params.movieId);

        res.json({
            success: true,
            data: shows,
        });
    } catch (err) {
        next(err);
    }
};

export const getShowsByTheatre = async (req, res, next) => {
    try {
        const shows = await showService.getShowsByTheatre(req.params.theatreId);

        res.json({
            success: true,
            data: shows,
        });
    } catch (err) {
        next(err);
    }
};

export const getShowsByScreen = async (req, res, next) => {
    try {
        const shows = await showService.getShowsByScreen(req.params.screenId);

        res.json({
            success: true,
            data: shows,
        });
    } catch (err) {
        next(err);
    }
};

export const updateShow = async (req, res, next) => {
    try {
        const data = showSchema.partial().parse(req.body);

        const show = await showService.updateShow(req.params.id, data);

        res.json({
            success: true,
            data: show,
        });
    } catch (err) {
        next(err);
    }
};

export const deleteShow = async (req, res, next) => {
    try {
        await showService.deleteShow(req.params.id);

        res.json({
            success: true,
            message: "Show deleted successfully",
        });
    } catch (err) {
        next(err);
    }
};