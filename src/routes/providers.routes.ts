import { Router } from "express";

import { getAll, getAllValidation } from "../controllers/providers.controller";

const providersRoutes = Router();

// GET /
providersRoutes.get("/", getAllValidation, getAll);

export default providersRoutes;
