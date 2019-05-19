import { Router } from "express";

import { login } from "../controllers/users.controller";

const router = Router();

// POST /login
router.post("/login", login);

export default router;
