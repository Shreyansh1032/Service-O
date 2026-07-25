import express from "express";

import {
    createShow,
    getAllShows,
    getShowById,
    getShowsByMovie,
    getShowsByTheatre,
    getShowsByScreen,
    updateShow,
    deleteShow
} from "../controllers/showController.js";

const router = express.Router();

router.post("/", createShow);

router.get("/", getAllShows);

router.get("/movie/:movieId", getShowsByMovie);

router.get("/theatre/:theatreId", getShowsByTheatre);

router.get("/screen/:screenId", getShowsByScreen);

router.get("/:id", getShowById);

router.put("/:id", updateShow);

router.delete("/:id", deleteShow);

export default router;