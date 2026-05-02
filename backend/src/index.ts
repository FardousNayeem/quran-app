import { Hono } from "hono";
import { logger } from "hono/logger";
import { corsMiddleware } from "@/middleware/cors.middleware";
import { notFound, onError } from "@/middleware/error.middleware";
import { registerRoutes } from "@/routes/index";
import { getSearchIndex } from "@/services/search.service";
import { PORT } from "@/config/constants";

const app = new Hono();

// Global middleware
app.use("*", logger());
app.use("*", corsMiddleware);

app.get("/", (c) =>
  c.json({
    name: "Quran App Backend",
    status: "ok",
    endpoints: ["/health", "/surah", "/surah/:id", "/search?q=...", "/audio/:surahNo/:ayahNo"],
  })
);

app.get("/health", (c) =>
  c.json({ status: "ok", timestamp: new Date().toISOString() })
);

registerRoutes(app);

app.notFound(notFound);
app.onError(onError);

getSearchIndex().catch((err) =>
  console.error("[Startup] Search index warm-up failed:", err)
);

console.log(`Backend running at http://localhost:${PORT}`);

export default {
  port: PORT,
  fetch: app.fetch,
};
