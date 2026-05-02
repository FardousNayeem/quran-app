import { Hono } from "hono";
import { getAyahById } from "@/services/quran.service";
import { TOTAL_SURAHS } from "@/config/constants";

export const ayahRouter = new Hono();

// GET /surah/:surahId/ayah/:ayahNo
ayahRouter.get("/:surahId/ayah/:ayahNo", async (c) => {
  const surahNo = Number(c.req.param("surahId"));
  const ayahNo = Number(c.req.param("ayahNo"));

  if (isNaN(surahNo) || surahNo < 1 || surahNo > TOTAL_SURAHS) {
    return c.json({ status: 400, message: "Invalid surah number." }, 400);
  }
  if (isNaN(ayahNo) || ayahNo < 1) {
    return c.json({ status: 400, message: "Invalid ayah number." }, 400);
  }

  const ayah = await getAyahById(surahNo, ayahNo);
  return c.json(ayah);
});