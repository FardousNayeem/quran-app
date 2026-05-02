import type { Hono } from "hono";
import { surahRouter } from "./surah.route";
import { ayahRouter } from "./ayah.route";
import { audioRouter } from "./audio.route";
import { searchRouter } from "./search.route";

export function registerRoutes(app: Hono): void {
  app.route("/surah", surahRouter);
  app.route("/surah", ayahRouter);  
  app.route("/audio", audioRouter);
  app.route("/search", searchRouter);
}