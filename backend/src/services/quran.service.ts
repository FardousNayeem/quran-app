import { QURAN_API_BASE, CACHE_TTL } from "@/config/constants";
import { cache } from "@/cache/memory.cache";

import type {
  AudioSource,
  Ayah,
  AyahFull,
  ReciterMap,
  SurahFull,
  SurahMeta,
  SurahResponse,
} from "@/types/quran.types";

class UpstreamApiError extends Error {
  constructor(message: string, public readonly statusCode = 502) {
    super(message);
    this.name = "UpstreamApiError";
  }
}

async function apiFetch<T>(path: string): Promise<T> {
  const url = `${QURAN_API_BASE}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    throw new UpstreamApiError("Unable to reach Quran API.", 502);
  }

  if (!res.ok) {
    const statusCode = res.status === 404 ? 404 : 502;
    throw new UpstreamApiError(
      `Quran API request failed with status ${res.status}.`,
      statusCode
    );
  }

  try {
    return (await res.json()) as T;
  } catch {
    throw new UpstreamApiError("Quran API returned invalid JSON.", 502);
  }
}

function toSurahMeta(raw: SurahMeta): SurahMeta {
  return {
    surahNo: raw.surahNo,
    surahName: raw.surahName,
    surahNameArabic: raw.surahNameArabic,
    surahNameArabicLong: raw.surahNameArabicLong,
    surahNameTranslation: raw.surahNameTranslation,
    revelationPlace: raw.revelationPlace,
    totalAyah: raw.totalAyah,
  };
}

function shapeSurah(raw: SurahFull): SurahResponse {
  const meta = toSurahMeta(raw);

  const ayahs: Ayah[] = Array.from({ length: raw.totalAyah }, (_, index) => ({
    ayahNo: index + 1,
    arabic1: raw.arabic1[index] ?? "",
    arabic2: raw.arabic2[index] ?? "",
    english: raw.english[index] ?? "",
    bengali: raw.bengali?.[index],
    urdu: raw.urdu?.[index],
  }));

  return {
    meta,
    surahAudio: raw.audio,
    ayahs,
  };
}

async function assertValidAyahNumber(
  surahNo: number,
  ayahNo: number
): Promise<void> {
  const meta = await getSurahMetaById(surahNo);

  if (!meta) {
    throw new UpstreamApiError("Surah not found.", 404);
  }

  if (ayahNo > meta.totalAyah) {
    throw new UpstreamApiError(
      `Invalid ayah number. Surah ${surahNo} has ${meta.totalAyah} ayahs.`,
      400
    );
  }
}

export async function getAllSurahs(): Promise<SurahMeta[]> {
  const cacheKey = "surah:list";
  const cached = cache.get<SurahMeta[]>(cacheKey);
  if (cached) return cached;

  // API return dosent include surahNo
  const raw = await apiFetch<Array<Omit<SurahMeta, "surahNo">>>("/surah.json");
  const data: SurahMeta[] = raw.map((surah, index) => ({
    ...surah,
    surahNo: index + 1,
  }));

  cache.set(cacheKey, data, CACHE_TTL.SURAH_LIST);
  return data;
}

export async function getSurahMetaById(
  surahNo: number
): Promise<SurahMeta | null> {
  const surahs = await getAllSurahs();
  return surahs[surahNo - 1] ?? null;
}

export async function getSurahById(surahNo: number): Promise<SurahResponse> {
  const cacheKey = `surah:${surahNo}`;
  const cached = cache.get<SurahResponse>(cacheKey);
  if (cached) return cached;

  const raw = await apiFetch<SurahFull>(`/${surahNo}.json`);
  const shaped = shapeSurah(raw);

  cache.set(cacheKey, shaped, CACHE_TTL.SURAH_FULL);
  return shaped;
}

export async function getAyahById(
  surahNo: number,
  ayahNo: number
): Promise<AyahFull> {
  await assertValidAyahNumber(surahNo, ayahNo);

  const cacheKey = `ayah:${surahNo}:${ayahNo}`;
  const cached = cache.get<AyahFull>(cacheKey);
  if (cached) return cached;

  const raw = await apiFetch<AyahFull>(`/${surahNo}/${ayahNo}.json`);
  cache.set(cacheKey, raw, CACHE_TTL.AYAH);
  return raw;
}

export async function getAyahAudio(
  surahNo: number,
  ayahNo: number
): Promise<ReciterMap> {
  await assertValidAyahNumber(surahNo, ayahNo);

  const cacheKey = `audio:ayah:${surahNo}:${ayahNo}`;
  const cached = cache.get<ReciterMap>(cacheKey);
  if (cached) return cached;

  const raw = await apiFetch<ReciterMap>(`/audio/${surahNo}/${ayahNo}.json`);
  cache.set(cacheKey, raw, CACHE_TTL.AUDIO);
  return raw;
}

export async function getSurahAudio(surahNo: number): Promise<ReciterMap> {
  const cacheKey = `audio:surah:${surahNo}`;
  const cached = cache.get<ReciterMap>(cacheKey);
  if (cached) return cached;

  const raw = await apiFetch<ReciterMap>(`/audio/${surahNo}.json`);
  cache.set(cacheKey, raw, CACHE_TTL.AUDIO);
  return raw;
}

export function pickAudioSource(
  audio: ReciterMap,
  reciterId: string
): AudioSource | null {
  return audio[reciterId] ?? audio["1"] ?? Object.values(audio)[0] ?? null;
}
