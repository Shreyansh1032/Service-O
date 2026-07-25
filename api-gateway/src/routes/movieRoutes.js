import express from "express";
import optionalAuthMiddleware from "../middleware/optionalAuthMiddleware.js";
import movieProxy from "../proxies/movieProxy.js";

const router = express.Router();
router.use("/", optionalAuthMiddleware, movieProxy);

export default router;