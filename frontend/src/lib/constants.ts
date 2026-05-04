import type {
  ArabicFont,
  FontSettings,
  TranslationFont,
} from "@/types/quran.types";

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

export const ARABIC_FONTS: { id: ArabicFont; label: string; cssVar: string }[] =
  [
    {
      id: "uthmanic",
      label: "KFGQ",
      cssVar: "var(--font-kfgq)",
    },
    {
      id: "amiri",
      label: "Amiri",
      cssVar: "var(--font-amiri)",
    },
    {
      id: "scheherazade",
      label: "Scheherazade",
      cssVar: "var(--font-scheherazade)",
    },
  ];

export const TRANSLATION_FONTS: {
  id: TranslationFont;
  label: string;
  cssVar: string;
}[] = [
  {
    id: "geist",
    label: "Inter",
    cssVar: "var(--font-app)",
  },
  {
    id: "lora",
    label: "Lora",
    cssVar: "var(--font-lora)",
  },
  {
    id: "sourceSerif",
    label: "Source Serif",
    cssVar: "var(--font-source-serif)",
  },
];

// Default Font Settings

export const DEFAULT_FONT_SETTINGS: FontSettings = {
  arabicFont: "uthmanic",
  arabicSize: 30,
  translationFont: "geist",
  translationSize: 17,
  showTranslation: true,
  showArabic2: false,
};

// Font Sizes in Pixels, equavalent to slider range.

export const ARABIC_SIZE_MIN = 18;
export const ARABIC_SIZE_MAX = 100;

export const TRANSLATION_SIZE_MIN = 14;
export const TRANSLATION_SIZE_MAX = 44;

// localStorage key

export const FONT_SETTINGS_KEY = "quran-font-settings";
export const RECITER_KEY = "quran-reciter";