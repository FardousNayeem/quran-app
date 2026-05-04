import type { ReciterMap, AudioSource } from "@/types/quran.types";

// Returns the best audio source for a given reciter
export function pickAudioSource(
  audio: ReciterMap,
  reciterId: string
): AudioSource | null {
  return audio[reciterId] ?? audio["1"] ?? Object.values(audio)[0] ?? null;
}

// Surah 9 (At-Tawbah) does not begin with Bismillah
export function hasBismillah(surahNo: number): boolean {
  return surahNo !== 1 && surahNo !== 9;
}

// Pad surah number for display: 1 → "001"
export function padSurahNo(n: number): string {
  return String(n).padStart(3, "0");
}

// Format ayah number with Arabic-Indic numerals for display
export function toArabicNumeral(n: number): string {
  return n
    .toString()
    .replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);
}

// Returns revelation badge label
export function revelationLabel(place: string): string {
  return place === "Mecca" ? "Makkah" : "Madinah";
}

 // API surah names without "-"
export function displaySurahName(name: string): string {
  const cleaned = name.replace(/-/g, " ").replace(/\s+/g, " ").trim();

  if (/^Al Faatiha$/i.test(cleaned)) {
    return "Al Fatihah";
  }
  if (/^Al Baqara$/i.test(cleaned)) {
    return "Al Baqarah";
  }
  if (/^aal i imraan$/i.test(cleaned)) {
    return "Al Imran";
  }
  if (/^An Nisaa$/i.test(cleaned)) {
    return "An Nisa";
  }
  if (/^Al Maaida$/i.test(cleaned)) {
    return "Al Ma'idah";
  }
  if (/^Al An'aam$/i.test(cleaned)) {
    return "An An'am";
  }

  return cleaned;
}

// API translation labels without changing wording.
export function displaySurahTranslation(translation: string): string {
  return translation.replace(/\s+/g, " ").trim();
}

// shows the long Arabic surah name
export function displaySurahArabicName(
  arabicName: string,
  arabicNameLong?: string
): string {
  const source = arabicNameLong || arabicName;

  return source
    .replace(/^سُورَةُ\s*/u, "")
    .replace(/^سورة\s*/u, "")
    .replace(/\s+/g, " ")
    .trim();
}