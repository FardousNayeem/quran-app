import type { Hono } from "hono";
import { audioRouter } from "@/routes/audio.route";
import { ayahRouter } from "@/routes/ayah.route";
import { searchRouter } from "@/routes/search.route";
import { surahRouter } from "@/routes/surah.route";

export function registerRoutes(app: Hono): void {
  app.route("/surah", ayahRouter);
  app.route("/surah", surahRouter);
  app.route("/audio", audioRouter);
  app.route("/search", searchRouter);
}
