import type { ReciterMap, AudioSource } from "@/types/quran.types";

/** Returns the best audio source for a given reciter, falling back to reciter 1 */
export function pickAudioSource(
  audio: ReciterMap,
  reciterId: string
): AudioSource | null {
  return audio[reciterId] ?? audio["1"] ?? Object.values(audio)[0] ?? null;
}

/** Surah 9 (At-Tawbah) does not begin with Bismillah */
export function hasBismillah(surahNo: number): boolean {
  return surahNo !== 9;
}

/** Pad surah number for display: 1 → "001" */
export function padSurahNo(n: number): string {
  return String(n).padStart(3, "0");
}

/** Format ayah number with Arabic-Indic numerals for display */
export function toArabicNumeral(n: number): string {
  return n
    .toString()
    .replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);
}

/** Returns revelation badge label */
export function revelationLabel(place: string): string {
  return place === "Mecca" ? "Meccan" : "Medinan";
}