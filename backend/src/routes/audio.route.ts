import { Hono } from "hono";
import {
  getAyahAudio,
  getSurahAudio,
  getSurahMetaById,
} from "@/services/quran.service";
import { TOTAL_SURAHS } from "@/config/constants";

export const audioRouter = new Hono();

// GET /audio/:surahNo - audio sources for a full surah
audioRouter.get("/:surahNo", async (c) => {
  const surahNo = Number(c.req.param("surahNo"));

  if (!Number.isInteger(surahNo) || surahNo < 1 || surahNo > TOTAL_SURAHS) {
    return c.json({ status: 400, message: "Invalid surah number." }, 400);
  }

  const audio = await getSurahAudio(surahNo);
  return c.json(audio);
});

// GET /audio/:surahNo/:ayahNo - audio sources for an ayah
audioRouter.get("/:surahNo/:ayahNo", async (c) => {
  const surahNo = Number(c.req.param("surahNo"));
  const ayahNo = Number(c.req.param("ayahNo"));

  if (!Number.isInteger(surahNo) || surahNo < 1 || surahNo > TOTAL_SURAHS) {
    return c.json({ status: 400, message: "Invalid surah number." }, 400);
  }

  if (!Number.isInteger(ayahNo) || ayahNo < 1) {
    return c.json({ status: 400, message: "Invalid ayah number." }, 400);
  }

  const meta = await getSurahMetaById(surahNo);
  if (!meta || ayahNo > meta.totalAyah) {
    return c.json(
      {
        status: 400,
        message: `Invalid ayah number. Surah ${surahNo} has ${meta?.totalAyah ?? 0} ayahs.`,
      },
      400
    );
  }

  const audio = await getAyahAudio(surahNo, ayahNo);
  return c.json(audio);
});
