import { Router } from "express";

import { login } from "../controllers/users.controller";

const usersRoutes = Router();

// POST /login
usersRoutes.post("/login", login);

export default usersRoutes;
