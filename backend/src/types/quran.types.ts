// Reciter

export interface AudioSource {
  reciter: string;
  url: string;
  originalUrl: string;
}

export type ReciterMap = Record<string, AudioSource>;

// Surah List

export interface SurahMeta {
  surahNo: number;
  surahName: string;
  surahNameArabic: string;
  surahNameArabicLong: string;
  surahNameTranslation: string;
  revelationPlace: string;
  totalAyah: number;
}

// Full Surah Response (/api/{surahNo}.json)

export interface VerseAudioEntry {
  reciter: string;
  audios: Array<{ url: string; originalUrl: string }>;
}

export interface SurahFull extends SurahMeta {
  audio: ReciterMap;                          // full-surah audio per reciter
  verseAudio: Record<string, VerseAudioEntry>; // per-ayah audio per reciter
  english: string[];
  arabic1: string[];
  arabic2: string[];
  bengali?: string[];
}

// Single Ayah (/api/{surahNo}/{ayahNo}.json)

export interface AyahFull extends SurahMeta {
  surahNo: number;
  ayahNo: number;
  audio: ReciterMap;
  english: string;
  arabic1: string;
  arabic2: string;
  bengali?: string;
}


// Frontend Responses 
// Ayah Response

export interface Ayah {
  ayahNo: number;
  arabic1: string;
  arabic2: string;
  english: string;
  bengali?: string;
  audio: Record<string, { reciter: string; url: string; originalUrl: string }>;
}

// Surah Response

export interface SurahResponse {
  meta: SurahMeta;
  surahAudio: ReciterMap;
  ayahs: Ayah[];
}

// Search

export interface SearchResult {
  surahNo: number;
  surahName: string;
  surahNameArabic: string;
  ayahNo: number;
  arabic1: string;
  english: string;
}

export interface SearchResponse {
  query: string;
  total: number;
  results: SearchResult[];
}

// API Error

export interface ApiError {
  status: number;
  message: string;
}