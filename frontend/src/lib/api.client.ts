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
  const headers = new Headers(init?.headers);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: "Unknown error" }));

    throw new ApiError(
      res.status,
      body.message ?? `Request failed: ${res.status}`
    );
  }

  return res.json() as Promise<T>;
}

// Surah

/** GET /surah — returns all 114 surah metadata objects */
export async function fetchAllSurahs(): Promise<SurahMeta[]> {
  return apiFetch<SurahMeta[]>("/surah");
}

/** GET /surah/:id — returns full surah with ayahs + audio */
export async function fetchSurah(surahNo: number): Promise<SurahResponse> {
  return apiFetch<SurahResponse>(`/surah/${surahNo}`);
}

// Ayah

/** GET /surah/:surahId/ayah/:ayahNo */
export async function fetchAyah(surahNo: number, ayahNo: number): Promise<Ayah> {
  return apiFetch<Ayah>(`/surah/${surahNo}/ayah/${ayahNo}`);
}

// Audio

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

// Search

/** GET /search?q=<query> */
export async function fetchSearch(
  query: string,
  signal?: AbortSignal
): Promise<SearchResponse> {
  const trimmed = query.trim();

  if (trimmed.length < 2) {
    return {
      query: trimmed,
      total: 0,
      results: [],
    };
  }

  const params = new URLSearchParams({ q: trimmed });

  return apiFetch<SearchResponse>(`/search?${params.toString()}`, {
    cache: "no-store",
    signal,
  });
}