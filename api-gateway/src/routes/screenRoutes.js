import express from "express";
import optionalAuthMiddleware from "../middleware/optionalAuthMiddleware.js";
import screenProxy from "../proxies/screenProxy.js";

const router = express.Router();
router.use("/", optionalAuthMiddleware, screenProxy);

export default router;