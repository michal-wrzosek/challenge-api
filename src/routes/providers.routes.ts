import { Router } from "express";

import { getAll, getAllValidation } from "../controllers/providers.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const providersRoutes = Router();

// GET /
providersRoutes.get("/", authMiddleware, getAllValidation, getAll);

export default providersRoutes;
