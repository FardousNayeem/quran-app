"use client";

import { useEffect, useState } from "react";
import { fetchSearch } from "@/lib/api.client";
import type { SearchResult } from "@/types/quran.types";

type SearchState = {
  results: SearchResult[];
  total: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: SearchState = {
  results: [],
  total: 0,
  isLoading: false,
  error: null,
};

export function useSearch() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<SearchState>(initialState);

  const trimmed = query.trim();
  const canSearch = trimmed.length >= 2;

  useEffect(() => {
    if (!canSearch) return;

    const controller = new AbortController();

    const timeoutId = window.setTimeout(() => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      fetchSearch(trimmed, controller.signal)
        .then((data) => {
          setState({
            results: data.results,
            total: data.total,
            isLoading: false,
            error: null,
          });
        })
        .catch((err: unknown) => {
          if (controller.signal.aborted) return;

          setState({
            results: [],
            total: 0,
            isLoading: false,
            error:
              err instanceof Error ? err.message : "Unable to search right now.",
          });
        });
    }, 260);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [trimmed, canSearch]);

  return {
    query,
    setQuery,
    results: canSearch ? state.results : [],
    total: canSearch ? state.total : 0,
    isLoading: canSearch ? state.isLoading : false,
    error: canSearch ? state.error : null,
  };
}