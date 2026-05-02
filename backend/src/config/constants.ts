export const QURAN_API_BASE =
  Bun.env.QURAN_API_BASE ?? "https://quranapi.pages.dev/api";

export const PORT = Number(Bun.env.PORT ?? 3001);

export const CORS_ORIGIN = Bun.env.CORS_ORIGIN ?? "http://localhost:3000";

export const RECITERS: Record<string, string> = {
  "1": "Mishary Rashid Al Afasy",
  "2": "Abu Bakr Al Shatri",
  "3": "Nasser Al Qatami",
  "4": "Yasser Al Dosari",
  "5": "Hani Ar Rifai",
};

// Cache TTLs (ms)
export const CACHE_TTL = {
  SURAH_LIST: 24 * 60 * 60 * 1000,
  SURAH_FULL: 12 * 60 * 60 * 1000,
  AYAH:        6 * 60 * 60 * 1000,
  SEARCH_INDEX: 24 * 60 * 60 * 1000,
};

export const SEARCH_MAX_RESULTS = 30;
export const TOTAL_SURAHS = 114;