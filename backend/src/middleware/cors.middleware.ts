import { cors } from "hono/cors";
import { CORS_ORIGINS } from "@/config/constants";

export const corsMiddleware = cors({
  origin: (origin: string | undefined) => {
    if (CORS_ORIGINS.includes("*")) return "*";
    if (!origin) return CORS_ORIGINS[0] ?? "";
    return CORS_ORIGINS.includes(origin) ? origin : "";
  },
  allowMethods: ["GET", "OPTIONS"],
  allowHeaders: ["Content-Type", "Accept"],
  maxAge: 86400,
});
