// Audio / Reciters

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

// Full Surah Response from /api/{surahNo}.json

export interface VerseAudioEntry {
  reciter: string;
  audios: Array<{ url: string; originalUrl: string }>;
}

export interface SurahFull extends SurahMeta {
  audio: ReciterMap;
  verseAudio?: Record<string, VerseAudioEntry>;
  english: string[];
  arabic1: string[];
  arabic2: string[];
  bengali?: string[];
  urdu?: string[];
}

// Single Ayah Response from /api/{surahNo}/{ayahNo}.json

export interface AyahFull extends SurahMeta {
  ayahNo: number;
  audio: ReciterMap;
  english: string;
  arabic1: string;
  arabic2: string;
  bengali?: string;
  urdu?: string;
}

// Backend responses for frontend

export interface Ayah {
  ayahNo: number;
  arabic1: string;
  arabic2: string;
  english: string;
  bengali?: string;
  urdu?: string;
  // Kept optional so SSG pages do not have to embed thousands of audio URLs.
  // The frontend can call GET /audio/:surahNo/:ayahNo when the user presses play.
  audio?: ReciterMap;
}

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
