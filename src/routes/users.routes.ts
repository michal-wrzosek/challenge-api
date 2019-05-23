import { Router } from "express";

import { login, me } from "../controllers/users.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const usersRoutes = Router();

// POST /login
usersRoutes.post("/login", login);

// GET /me
usersRoutes.get("/me", authMiddleware, me);

export default usersRoutes;
