import { Router } from "express";

import { getAll } from "../controllers/providers.controller";

const providersRoutes = Router();

// GET /
providersRoutes.get("/", getAll);

export default providersRoutes;
