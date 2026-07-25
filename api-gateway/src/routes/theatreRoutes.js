import express from "express";
import optionalAuthMiddleware from "../middleware/optionalAuthMiddleware.js";
import theatreProxy from "../proxies/theatreProxy.js";

const router = express.Router();
router.use("/", optionalAuthMiddleware, theatreProxy);

export default router;