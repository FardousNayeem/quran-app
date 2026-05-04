// Audio

export interface AudioSource {
  reciter: string;
  url: string;
  originalUrl: string;
}

export type ReciterMap = Record<string, AudioSource>;

// Surah Metadata

export interface SurahMeta {
  surahNo: number;
  surahName: string;
  surahNameArabic: string;
  surahNameArabicLong: string;
  surahNameTranslation: string;
  revelationPlace: "Mecca" | "Medina" | string;
  totalAyah: number;
}

// Single Ayah (in SurahResponse)

export interface Ayah {
  ayahNo: number;
  arabic1: string;
  arabic2: string;
  english: string;
  bengali?: string;
  urdu?: string;
  audio?: ReciterMap;
}

// Full Surah Response (GET /surah/:id)

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

// Font Settings (localStorage)

export type ArabicFont = "uthmanic" | "amiri" | "scheherazade";
export type TranslationFont = "geist" | "lora" | "sourceSerif";

export interface FontSettings {
  arabicFont: ArabicFont;
  arabicSize: number;
  translationFont: TranslationFont;
  translationSize: number; 
  showTranslation: boolean;
  showArabic2: boolean;     // Uthmani script variant
}