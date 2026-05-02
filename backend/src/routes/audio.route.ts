import { Hono } from "hono";
import { getAyahAudio } from "@/services/quran.service";
import { TOTAL_SURAHS } from "@/config/constants";

export const audioRouter = new Hono();

// GET /audio/:surahNo/:ayahNo — audio sources for a ayah
audioRouter.get("/:surahNo/:ayahNo", async (c) => {
  const surahNo = Number(c.req.param("surahNo"));
  const ayahNo = Number(c.req.param("ayahNo"));

  if (isNaN(surahNo) || surahNo < 1 || surahNo > TOTAL_SURAHS) {
    return c.json({ status: 400, message: "Invalid surah number." }, 400);
  }
  if (isNaN(ayahNo) || ayahNo < 1) {
    return c.json({ status: 400, message: "Invalid ayah number." }, 400);
  }

  const audio = await getAyahAudio(surahNo, ayahNo);
  return c.json(audio);
});