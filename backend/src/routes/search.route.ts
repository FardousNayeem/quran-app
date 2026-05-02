import { Hono } from "hono";
import { searchAyahs } from "@/services/search.service";

export const searchRouter = new Hono();

// GET /search?q=<query>
searchRouter.get("/", async (c) => {
  const q = c.req.query("q")?.trim() ?? "";

  if (q.length < 2) {
    return c.json(
      { status: 400, message: "Query must be at least 2 characters." },
      400
    );
  }

  const results = await searchAyahs(q);
  return c.json({
    query: q,
    total: results.length,
    results,
  });
});
