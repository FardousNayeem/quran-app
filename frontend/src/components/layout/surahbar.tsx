"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { SurahMeta } from "@/types/quran.types";
import {
  displaySurahArabicName,
  displaySurahName,
  displaySurahTranslation,
} from "@/lib/quran.helpers";

interface Props {
  surahs: SurahMeta[];
  activeSurahNo: number;
}

const TABS = ["Surah", "Juz", "Page"] as const;

export function SurahSidebar({ surahs, activeSurahNo }: Props) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Surah");
  const [query, setQuery] = useState("");
  const activeRef = useRef<HTMLAnchorElement>(null);

  const activeIdx = TABS.indexOf(tab);

  const filteredSurahs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return surahs;

    return surahs.filter((surah) => {
      const name = displaySurahName(surah.surahName);
      const translation = displaySurahTranslation(surah.surahNameTranslation);

      return (
        String(surah.surahNo).includes(normalizedQuery) ||
        name.toLowerCase().includes(normalizedQuery) ||
        translation.toLowerCase().includes(normalizedQuery) ||
        surah.surahNameArabic.includes(query.trim())
      );
    });
  }, [query, surahs]);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [activeSurahNo]);

  return (
    <aside
      aria-label="Surah navigation"
      className="fixed z-20 hidden flex-col overflow-hidden lg:flex"
      style={{
        left: "var(--side-nav-size)",
        top: "var(--top-nav-size)",
        height: "calc(100vh - var(--top-nav-size))",
        width: "var(--left-sidebar-size)",
        backgroundColor: "var(--primary-bg)",
        borderRight: "1px solid var(--border-color)",
      }}
    >
      <div className="flex h-full w-full flex-col overflow-hidden pt-6">
        <div className="px-[26px]">
          <div
            className="relative isolate mb-4 flex min-h-10 items-center rounded-full border-4"
            style={{
              borderColor: "var(--secondary-bg)",
              backgroundColor: "var(--secondary-bg)",
            }}
          >
            {TABS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className="relative z-10 h-full w-full py-1 text-xs transition-colors"
                style={{
                  color:
                    tab === item
                      ? "var(--pure-color)"
                      : "var(--subtitle-color-secondary)",
                  fontWeight: tab === item ? 500 : 300,
                }}
              >
                {item}
              </button>
            ))}

            <div
              className="absolute h-full rounded-full transition-transform duration-300 ease-in-out"
              style={{
                width: "33.00%",
                transform: `translateX(${activeIdx * 100}%)`,
                backgroundColor: "var(--primary-bg)",
              }}
            />
          </div>

          <div
            className="mb-4 flex h-10 items-center gap-3 rounded-full border px-3 text-base"
            style={{
              backgroundColor: "var(--secondary-bg)",
              borderColor: "var(--border-color)",
            }}
          >
            <SearchIcon className="h-[21px] w-[21px] shrink-0 text-[var(--subtitle-color)]" />

            <input
              type="text"
              placeholder="Search Surah"
              aria-label="Search Surah"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent font-light outline-none placeholder:text-[var(--subtitle-color-70)]"
              style={{
                color: "var(--pure-color)",
                fontSize: "16px",
              }}
            />
          </div>
        </div>

        <div className="surah-scroll-area min-h-0 flex-1 overflow-y-auto pb-4">
          {filteredSurahs.map((surah) => {
            const isActive = surah.surahNo === activeSurahNo;
            const name = displaySurahName(surah.surahName);
            const translation = displaySurahTranslation(surah.surahNameTranslation);
            const arabicName = displaySurahArabicName(
                surah.surahNameArabic,
                surah.surahNameArabicLong
            );

            return (
              <div key={surah.surahNo} className="block px-[26px] pb-2">
                <Link
                  ref={isActive ? activeRef : null}
                  href={`/surah/${surah.surahNo}`}
                  className="group/card flex h-[76px] w-full min-w-[200px] cursor-pointer select-none items-center justify-between gap-5 rounded-xl border px-4 font-semibold transition-colors duration-200 hover:bg-[var(--primary-7)]"
                  style={{
                    borderColor: isActive
                      ? "rgba(66,128,56,0.32)"
                      : "var(--border-color)",
                    backgroundColor: isActive
                      ? "var(--primary-7)"
                      : "transparent",
                  }}
                >
                  <DiamondBadge number={surah.surahNo} active={isActive} />

                  <div className="min-w-0 flex-1 text-start">
                    <p
                      className="line-clamp-1 pr-3 text-[15px] font-semibold leading-[1.25]"
                      style={{ color: "var(--pure-color)" }}
                    >
                      {name}
                    </p>

                    <p
                      className="mt-[5px] line-clamp-1 text-[13px] font-normal leading-[1.25]"
                      style={{ color: "var(--subtitle-color-secondary)" }}
                    >
                      {translation}
                    </p>
                  </div>

                  <span
                    className="block shrink-0 text-right text-lg leading-none"
                    style={{
                        color: "var(--subtitle-color)",
                        fontFamily: "var(--font-calligraphy), var(--font-arabic), Amiri, serif",
                    }}
                    >
                    {arabicName}
                </span>
                </Link>
              </div>
            );
          })}

          {filteredSurahs.length === 0 && (
            <div className="px-[26px] py-8 text-center">
              <p className="text-[14px] text-[var(--subtitle-color)]">
                No surah found.
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function DiamondBadge({
  number,
  active,
}: {
  number: number;
  active: boolean;
}) {
  return (
    <div
      className="relative flex size-8 min-h-8 min-w-8 shrink-0 rotate-45 items-center justify-center rounded-[6px] transition-colors duration-200 shadow-none"
      style={{
        backgroundColor: active ? "var(--primary)" : "var(--secondary-bg)",
        border: "none",
        boxShadow: "none",
      }}
    >
      <span
        className="-rotate-45 text-[13px] font-bold leading-none"
        style={{
          color: active ? "var(--primary-fg)" : "var(--subtitle-color)",
        }}
      >
        {number}
      </span>
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