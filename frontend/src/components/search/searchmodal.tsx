"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useSearch } from "@/hooks/useSearch";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { query, setQuery, results, total, isLoading, error } = useSearch();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Quran"
      className="fixed inset-0 z-[80] bg-black/60 px-4 backdrop-blur-[2px]"
      onMouseDown={() => onOpenChange(false)}
    >
      <div
        className="mx-auto mt-[86px] w-full max-w-[680px] overflow-hidden rounded-[18px] border border-[var(--border-color)] bg-[var(--primary-bg)] shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex h-[64px] items-center gap-3 border-b border-[var(--border-color)] px-5">
          <SearchIcon className="h-[21px] w-[21px] shrink-0 text-[var(--primary)]" />

          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by Arabic or English translation"
            className="h-full min-w-0 flex-1 bg-transparent text-[17px] font-light text-[var(--pure-color)] outline-none placeholder:text-[var(--subtitle-color-70)]"
          />

          <button
            type="button"
            aria-label="Close search"
            onClick={() => onOpenChange(false)}
            className="flex size-9 items-center justify-center rounded-full text-[var(--subtitle-color)] transition-colors hover:bg-[var(--primary-7)] hover:text-[var(--pure-color)]"
          >
            <CloseIcon className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="max-h-[470px] overflow-y-auto px-3 py-3">
          {query.trim().length < 2 ? (
            <SearchState
              title="Search the Quran"
              description="Type at least 2 characters to search ayahs by Arabic text or English translation."
            />
          ) : isLoading ? (
            <SearchState
              title="Searching..."
              description="Looking through indexed ayahs."
            />
          ) : error ? (
            <SearchState title="Search failed" description={error} />
          ) : results.length === 0 ? (
            <SearchState
              title="No results found"
              description="Try another word or a shorter phrase."
            />
          ) : (
            <div className="space-y-2">
              <div className="px-2 pb-1 text-[13px] text-[var(--subtitle-color)]">
                {total} result{total === 1 ? "" : "s"}
              </div>

              {results.map((result) => (
                <Link
                  key={`${result.surahNo}:${result.ayahNo}`}
                  href={`/surah/${result.surahNo}#ayah-${result.surahNo}:${result.ayahNo}`}
                  onClick={() => onOpenChange(false)}
                  className="block rounded-[12px] border border-transparent px-4 py-3 transition-colors hover:border-[rgba(66,128,56,0.3)] hover:bg-[var(--primary-7)]"
                >
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <p className="text-[14px] font-semibold text-[var(--primary)]">
                      {result.surahNo}:{result.ayahNo}
                    </p>

                    <p
                      dir="rtl"
                      className="max-w-[360px] truncate text-right font-arabic text-[18px] text-[var(--subtitle-color)]"
                    >
                      {result.arabic1}
                    </p>
                  </div>

                  <p className="mb-1 text-[15px] font-semibold text-[var(--pure-color)]">
                    {result.surahName}
                  </p>

                  <p className="line-clamp-2 text-[14px] leading-6 text-[var(--subtitle-color)]">
                    {result.english}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[190px] flex-col items-center justify-center px-8 text-center">
      <p className="text-[18px] font-semibold text-[var(--pure-color)]">
        {title}
      </p>
      <p className="mt-2 max-w-[420px] text-[14px] leading-6 text-[var(--subtitle-color)]">
        {description}
      </p>
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M18.3789 18.3721L14.7539 14.7471M16.7122 10.0387C16.7122 13.7206 13.7275 16.7054 10.0456 16.7054C6.36367 16.7054 3.37891 13.7206 3.37891 10.0387C3.37891 6.35684 6.36367 3.37207 10.0456 3.37207C13.7275 3.37207 16.7122 6.35684 16.7122 10.0387Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}