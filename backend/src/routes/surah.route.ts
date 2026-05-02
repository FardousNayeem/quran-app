import { Hono } from "hono";
import { getAllSurahs, getSurahById } from "@/services/quran.service";
import { TOTAL_SURAHS } from "@/config/constants";

export const surahRouter = new Hono();

// GET /surah — all 114 surahs
surahRouter.get("/", async (c) => {
  const surahs = await getAllSurahs();
  return c.json(surahs);
});

// GET /surah/:id — full surah with all ayahs and audio
surahRouter.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));

  if (isNaN(id) || id < 1 || id > TOTAL_SURAHS) {
    return c.json({ status: 400, message: "Invalid surah number. Must be 1–114." }, 400);
  }

  const surah = await getSurahById(id);
  return c.json(surah);
});