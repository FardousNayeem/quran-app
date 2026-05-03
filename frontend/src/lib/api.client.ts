import { API_URL } from "@/lib/constants";
import type {
  SurahMeta,
  SurahResponse,
  Ayah,
  ReciterMap,
  SearchResponse,
} from "@/types/quran.types";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: "Unknown error" }));
    throw new ApiError(res.status, body.message ?? `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ─── Surah ───────────────────────────────────────────────────────────────────

/** GET /surah — returns all 114 surah metadata objects */
export async function fetchAllSurahs(): Promise<SurahMeta[]> {
  return apiFetch<SurahMeta[]>("/surah");
}

/** GET /surah/:id — returns full surah with ayahs + audio */
export async function fetchSurah(surahNo: number): Promise<SurahResponse> {
  return apiFetch<SurahResponse>(`/surah/${surahNo}`);
}

// ─── Ayah ────────────────────────────────────────────────────────────────────

/** GET /surah/:surahId/ayah/:ayahNo */
export async function fetchAyah(surahNo: number, ayahNo: number): Promise<Ayah> {
  return apiFetch<Ayah>(`/surah/${surahNo}/ayah/${ayahNo}`);
}

// ─── Audio ───────────────────────────────────────────────────────────────────

/** GET /audio/:surahNo/:ayahNo — returns ReciterMap for a single ayah */
export async function fetchAyahAudio(
  surahNo: number,
  ayahNo: number
): Promise<ReciterMap> {
  return apiFetch<ReciterMap>(`/audio/${surahNo}/${ayahNo}`);
}

/** GET /audio/:surahNo — returns ReciterMap for the full surah */
export async function fetchSurahAudio(surahNo: number): Promise<ReciterMap> {
  return apiFetch<ReciterMap>(`/audio/${surahNo}`);
}

// ─── Search ──────────────────────────────────────────────────────────────────

/** GET /search?q=<query> */
export async function fetchSearch(query: string): Promise<SearchResponse> {
  const params = new URLSearchParams({ q: query });
  return apiFetch<SearchResponse>(`/search?${params.toString()}`);
}