import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";

import { NODE_ENV } from "./configuration/envs";
import { NODE_ENVS } from "./types/NodeEnvs";
import usersRoutes from "./routes/users.routes";
import notFoundMiddleware from "./middlewares/notFound.middleware";
import errorMiddleware from "./middlewares/error.middleware";
import { CORSMiddleware } from "./middlewares/CORS.middleware";
import providersRoutes from "./routes/providers.routes";

const app = express();

// Logging
if (NODE_ENV !== NODE_ENVS.TEST) app.use(morgan("short"));

// Body parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS
app.use(CORSMiddleware);

// Routes
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/providers", providersRoutes);

// Error middlewares
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
