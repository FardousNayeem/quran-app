import { QURAN_API_BASE, CACHE_TTL } from "@/config/constants";
import { cache } from "@/cache/memory.cache";

import type {
  SurahMeta, SurahFull, SurahResponse, AyahFull, Ayah,
} from "@/types/quran.types";


// Helpers

async function apiFetch<T>(path: string): Promise<T> {
  const url = `${QURAN_API_BASE}${path}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Upstream API error ${res.status} for ${url}`);
  }
  return res.json() as Promise<T>;
}

// raw SurahFull into frontend SurahResponse
function shapeSurah(raw: SurahFull): SurahResponse {
  const meta: SurahMeta = {
    surahNo: raw.surahNo,
    surahName: raw.surahName,
    surahNameArabic: raw.surahNameArabic,
    surahNameArabicLong: raw.surahNameArabicLong,
    surahNameTranslation: raw.surahNameTranslation,
    revelationPlace: raw.revelationPlace,
    totalAyah: raw.totalAyah,
  };

  const ayahs: Ayah[] = raw.english.map((englishText, index) => {
    const ayahNo = index + 1;

    // Build ayah audio from verseAudio
    const audio: Ayah["audio"] = {};
    for (const [reciterId, reciterData] of Object.entries(raw.verseAudio)) {
      const audioEntry = reciterData.audios[index];
      if (audioEntry) {
        audio[reciterId] = {
          reciter: reciterData.reciter,
          url: audioEntry.url,
          originalUrl: audioEntry.originalUrl,
        };
      }
    }

    return {
      ayahNo,
      arabic1: raw.arabic1[index] ?? "",
      arabic2: raw.arabic2[index] ?? "",
      english: englishText,
      bengali: raw.bengali?.[index],
      audio,
    };
  });

  return {
    meta,
    surahAudio: raw.audio,
    ayahs,
  };
}

// Public Service Methods

export async function getAllSurahs(): Promise<SurahMeta[]> {
  const cacheKey = "surah:list";
  const cached = cache.get<SurahMeta[]>(cacheKey);
  if (cached) return cached;

  // The surah list from the API has no surahNo — we add it by index
  const raw = await apiFetch<Omit<SurahMeta, "surahNo">[]>("/surah.json");
  const data: SurahMeta[] = raw.map((s, i) => ({ ...s, surahNo: i + 1 }));

  cache.set(cacheKey, data, CACHE_TTL.SURAH_LIST);
  return data;
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
  const cacheKey = `ayah:${surahNo}:${ayahNo}`;
  const cached = cache.get<AyahFull>(cacheKey);
  if (cached) return cached;

  const raw = await apiFetch<AyahFull>(`/${surahNo}/${ayahNo}.json`);
  cache.set(cacheKey, raw, CACHE_TTL.AYAH);
  return raw;
}

export async function getAyahAudio(surahNo: number, ayahNo: number) {
  const raw = await apiFetch<AyahFull["audio"]>(
    `/audio/${surahNo}/${ayahNo}.json`
  );
  return raw;
}