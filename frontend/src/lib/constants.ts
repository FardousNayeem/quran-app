import type { ArabicFont, FontSettings, TranslationFont } from "@/types/quran.types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const TOTAL_SURAHS = 114;

// Reciters

export const RECITERS: Record<string, string> = {
  "1": "Mishary Rashid Al Afasy",
  "2": "Abu Bakr Al Shatri",
  "3": "Nasser Al Qatami",
  "4": "Yasser Al Dosari",
  "5": "Hani Ar Rifai",
};

export const DEFAULT_RECITER_ID = "1";

// Font Options

export const ARABIC_FONTS: { id: ArabicFont; label: string; cssVar: string }[] = [
  { id: "uthmanic", label: "Uthmanic (KFGQ)", cssVar: "'KFGQ Uthmanic', serif" },
  { id: "amiri",    label: "Amiri",           cssVar: "'Amiri', serif" },
  { id: "scheherazade", label: "Scheherazade", cssVar: "'Scheherazade New', serif" },
];

export const TRANSLATION_FONTS: { id: TranslationFont; label: string; cssVar: string }[] = [
  { id: "geist",       label: "Geist Sans",    cssVar: "var(--font-geist-sans)" },
  { id: "lora",        label: "Lora",          cssVar: "'Lora', serif" },
  { id: "sourceSerif", label: "Source Serif",  cssVar: "'Source Serif 4', serif" },
];

// Default Font Settings

export const DEFAULT_FONT_SETTINGS: FontSettings = {
  arabicFont: "uthmanic",
  arabicSize: 2.2,
  translationFont: "geist",
  translationSize: 1.0,
  showTranslation: true,
  showArabic2: false,
};

// Arabic Size Bound

export const ARABIC_SIZE_MIN = 1.5;
export const ARABIC_SIZE_MAX = 3.5;
export const TRANSLATION_SIZE_MIN = 0.8;
export const TRANSLATION_SIZE_MAX = 1.4;

// localStorage key

export const FONT_SETTINGS_KEY = "quran-font-settings";
export const RECITER_KEY = "quran-reciter";