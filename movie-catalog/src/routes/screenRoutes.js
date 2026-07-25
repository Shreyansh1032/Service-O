import express from "express";

import {
    create,
    getAll,
    getById,
    getByTheatre,
    update,
    remove
} from "../controllers/screenController.js";

const router = express.Router();

router.post("/", create);

router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Screen route working"
    });
});


router.get("/", getAll);

router.get("/theatre/:theatreId", getByTheatre);

router.get("/:id", getById);

router.put("/:id", update);

router.delete("/:id", remove);

export default router;