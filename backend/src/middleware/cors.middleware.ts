import { cors } from "hono/cors";
import { CORS_ORIGIN } from "@/config/constants";

export const corsMiddleware = cors({
  origin: CORS_ORIGIN,
  allowMethods: ["GET", "OPTIONS"],
  allowHeaders: ["Content-Type"],
  maxAge: 86400,
});