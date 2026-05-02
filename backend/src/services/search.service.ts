import { QURAN_API_BASE, CACHE_TTL, SEARCH_MAX_RESULTS } from "@/config/constants";
import { cache } from "@/cache/memory.cache";
import type { SearchResult, SurahMeta } from "@/types/quran.types";

interface TranslationDumpSurah extends SurahMeta {
  translation?: string[];
  english?: string[];
  arabic1?: string[];
  arabic2?: string[];
}

interface IndexEntry {
  surahNo: number;
  surahName: string;
  surahNameArabic: string;
  ayahNo: number;
  arabic1: string;
  english: string;
  _englishLower: string;
  _arabicNormalized: string;
}

const INDEX_CACHE_KEY = "search:index";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${QURAN_API_BASE}${path}`, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`${path} fetch failed: ${res.status}`);
  }

  return (await res.json()) as T;
}

function getVerses(
  surah: TranslationDumpSurah,
  preferredKey: "english" | "arabic1" | "arabic2"
): string[] {
  return surah.translation ?? surah[preferredKey] ?? [];
}

function normalizeArabic(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ـ/g, "")
    .trim();
}

async function buildIndex(): Promise<IndexEntry[]> {
  console.log("[Search] Building Quran search index...");

  const [englishData, arabicData] = await Promise.all([
    fetchJson<TranslationDumpSurah[]>("/english.json"),
    fetchJson<TranslationDumpSurah[]>("/arabic1.json"),
  ]);

  const arabicMap = new Map<number, string[]>();
  for (const surah of arabicData) {
    arabicMap.set(surah.surahNo, getVerses(surah, "arabic1"));
  }

  const index: IndexEntry[] = [];

  for (const surah of englishData) {
    const englishAyahs = getVerses(surah, "english");
    const arabicAyahs = arabicMap.get(surah.surahNo) ?? [];
    const maxAyahCount = Math.max(englishAyahs.length, arabicAyahs.length);

    for (let i = 0; i < maxAyahCount; i += 1) {
      const english = englishAyahs[i] ?? "";
      const arabic = arabicAyahs[i] ?? "";

      index.push({
        surahNo: surah.surahNo,
        surahName: surah.surahName,
        surahNameArabic: surah.surahNameArabic,
        ayahNo: i + 1,
        arabic1: arabic,
        english,
        _englishLower: english.toLowerCase(),
        _arabicNormalized: normalizeArabic(arabic),
      });
    }
  }

  console.log(`[Search] Index built: ${index.length} ayahs indexed.`);
  return index;
}

export async function getSearchIndex(): Promise<IndexEntry[]> {
  const cached = cache.get<IndexEntry[]>(INDEX_CACHE_KEY);
  if (cached) return cached;

  const index = await buildIndex();
  cache.set(INDEX_CACHE_KEY, index, CACHE_TTL.SEARCH_INDEX);
  return index;
}

export async function searchAyahs(query: string): Promise<SearchResult[]> {
  const trimmedQuery = query.trim();
  if (trimmedQuery.length < 2) return [];

  const index = await getSearchIndex();
  const englishQuery = trimmedQuery.toLowerCase();
  const arabicQuery = normalizeArabic(trimmedQuery);

  const results: SearchResult[] = [];

  for (const entry of index) {
    const isMatch =
      entry._englishLower.includes(englishQuery) ||
      entry._arabicNormalized.includes(arabicQuery);

    if (!isMatch) continue;

    results.push({
      surahNo: entry.surahNo,
      surahName: entry.surahName,
      surahNameArabic: entry.surahNameArabic,
      ayahNo: entry.ayahNo,
      arabic1: entry.arabic1,
      english: entry.english,
    });

    if (results.length >= SEARCH_MAX_RESULTS) break;
  }

  return results;
}
