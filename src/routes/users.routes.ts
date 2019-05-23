import { Router } from "express";

import { login, me } from "../controllers/users.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const usersRoutes = Router();

// POST /login
usersRoutes.post("/login", login);

// GET /me
usersRoutes.post("/me", authMiddleware, me);

export default usersRoutes;
