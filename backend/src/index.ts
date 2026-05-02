import { Hono } from "hono";
import { logger } from "hono/logger";
import { corsMiddleware } from "@/middleware/cors.middleware";
import { notFound, onError } from "@/middleware/error.middleware";
import { registerRoutes } from "@/routes/index";
import { getSearchIndex } from "@/services/search.service";
import { PORT } from "@/config/constants";

const app = new Hono();

// Global Middleware
app.use("*", logger());
app.use("*", corsMiddleware);

// Health Check
app.get("/health", (c) =>
  c.json({ status: "ok", timestamp: new Date().toISOString() })
);

// Routes
registerRoutes(app); 

// Error Handling
app.notFound(notFound);
app.onError(onError);

// Warm up search index in background on startup
getSearchIndex().catch((err) =>
  console.error("[Startup] Search index warm-up failed:", err)
);

// Start
export default {
  port: PORT,
  fetch: app.fetch,
};

console.log(`Backend running at http://localhost:${PORT}`);