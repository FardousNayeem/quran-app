import { QURAN_API_BASE, CACHE_TTL, SEARCH_MAX_RESULTS } from "@/config/constants";
import { cache } from "@/cache/memory.cache";
import type { SearchResult } from "@/types/quran.types";


interface SurahEnglish {
  surahNo: number;
  surahName: string;
  surahNameArabic: string;
  totalAyah: number;
  translation: string[];   // english.json
}

interface SurahArabic {
  surahNo: number;
  arabic1: string[];       // arabic1.json
}

interface IndexEntry {
  surahNo: number;
  surahName: string;
  surahNameArabic: string;
  ayahNo: number;
  arabic1: string;
  english: string;
  _englishLower: string;
  _arabicLower: string;
}

const INDEX_CACHE_KEY = "search:index";

// Build Index

async function buildIndex(): Promise<IndexEntry[]> {
  console.log("[Search] Fetching translation dumps in parallel...");

  // Fetch both langs concurrently
  const [englishRes, arabicRes] = await Promise.all([
    fetch(`${QURAN_API_BASE}/english.json`),
    fetch(`${QURAN_API_BASE}/arabic1.json`),
  ]);

  if (!englishRes.ok) throw new Error(`english.json fetch failed: ${englishRes.status}`);
  if (!arabicRes.ok) throw new Error(`arabic1.json fetch failed: ${arabicRes.status}`);

  const [englishData, arabicData] = await Promise.all([
    englishRes.json() as Promise<SurahEnglish[]>,
    arabicRes.json() as Promise<SurahArabic[]>,
  ]);

  // SurahNo → arabic1[] lookup map
  const arabicMap = new Map<number, string[]>();
  for (const surah of arabicData) {
    arabicMap.set(surah.surahNo, surah.arabic1);
  }

  const index: IndexEntry[] = [];

  for (const surah of englishData) {
    const arabicAyahs = arabicMap.get(surah.surahNo) ?? [];

    for (let i = 0; i < surah.translation.length; i++) {
      const english = surah.translation[i] ?? "";
      const arabic = arabicAyahs[i] ?? "";

      index.push({
        surahNo: surah.surahNo,
        surahName: surah.surahName,
        surahNameArabic: surah.surahNameArabic,
        ayahNo: i + 1,
        arabic1: arabic,
        english,
        _englishLower: english.toLowerCase(),
        _arabicLower: arabic,
      });
    }
  }

  console.log(`[Search] Index built: ${index.length} ayahs indexed.`);
  return index;
}

// Public API

export async function getSearchIndex(): Promise<IndexEntry[]> {
  const cached = cache.get<IndexEntry[]>(INDEX_CACHE_KEY);
  if (cached) return cached;

  const index = await buildIndex();
  cache.set(INDEX_CACHE_KEY, index, CACHE_TTL.SEARCH_INDEX);
  return index;
}

export async function searchAyahs(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  const index = await getSearchIndex();
  const q = query.trim().toLowerCase();

  const results: SearchResult[] = [];

  for (const entry of index) {
    if (
      entry._englishLower.includes(q) ||
      entry._arabicLower.includes(query.trim())
    ) {
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
  }

  return results;
}