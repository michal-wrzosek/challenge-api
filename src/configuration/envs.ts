import { NODE_ENVS } from "../types/NodeEnvs";

// Let's keep all env in one place

export const NODE_ENV: NODE_ENVS =
  (process.env.NODE_ENV as NODE_ENVS) || NODE_ENVS.DEVELOPMENT;
export const PORT: number = Number(process.env.PORT) || 3000;
export const MONGODB_URI: string = process.env.MONGODB_URI;
export const JWT_SECRET: string = process.env.JWT_SECRET;
export const MASTER_USER_EMAIL: string = process.env.MASTER_USER_EMAIL;
export const MASTER_USER_PASSWORD: string = process.env.MASTER_USER_PASSWORD;
