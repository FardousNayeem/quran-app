"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { SurahMeta } from "@/types/quran.types";

interface Props {
  surahs: SurahMeta[];
  activeSurahNo: number;
}

function DiamondBadge({ n, active }: { n: number; active: boolean }) {
  return (
    <div className="relative flex size-8 min-h-8 min-w-8 items-center justify-center shrink-0">
      <div
        className="absolute inset-0 rotate-45 rounded-[6px]"
        style={{
          backgroundColor: active ? "var(--primary)" : "var(--secondary-bg)",
          border: active ? "none" : "1px solid var(--border-color)",
        }}
      />
      <span
        className="-rotate-0 relative z-10 text-[13px] font-medium"
        style={{ color: active ? "white" : "var(--subtitle-color)" }}
      >
        {n}
      </span>
    </div>
  );
}

export function SurahSidebar({ surahs, activeSurahNo }: Props) {
  const [tab, setTab] = useState<"Surah" | "Juz" | "Page">("Surah");
  const [query, setQuery] = useState("");
  const activeRef = useRef<HTMLAnchorElement>(null);

  const filtered = surahs.filter((s) =>
    s.surahName.toLowerCase().includes(query.toLowerCase()) ||
    String(s.surahNo).includes(query)
  );

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeSurahNo]);

  const tabs = ["Surah", "Juz", "Page"] as const;
  const activeIdx = tabs.indexOf(tab);

  return (
    <div
      className="fixed top-0 z-30 flex h-full flex-col overflow-x-hidden"
      style={{
        left: "var(--side-nav-size)",
        width: "var(--left-sidebar-size)",
        backgroundColor: "var(--secondary-bg)",
        borderRight: "1px solid var(--border-color)",
        paddingTop: "var(--top-nav-size)",
      }}
    >
      <div className="flex h-full w-full flex-col overflow-y-auto pt-6">

        {/* Tabs */}
        <div className="relative isolate flex min-h-10 items-center rounded-full border-4 mb-4 mx-[26px]"
          style={{ borderColor: "var(--secondary-bg)", backgroundColor: "var(--secondary-bg)" }}>
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="z-10 h-full w-full text-[15px] font-medium py-2 transition-colors"
              style={{ color: tab === t ? "var(--pure-color)" : "var(--subtitle-color-secondary)" }}
            >
              {t}
            </button>
          ))}
          {/* Sliding pill */}
          <div
            className="absolute h-full rounded-full transition-transform duration-300 ease-in-out"
            style={{
              width: "calc(33.333%)",
              transform: `translateX(${activeIdx * 100}%)`,
              backgroundColor: "var(--primary-bg)",
            }}
          />
        </div>

        {/* Search */}
        <div className="mb-4 px-[26px]">
          <div
            className="flex h-10 items-center gap-3 rounded-full px-3 border"
            style={{
              backgroundColor: "var(--secondary-bg)",
              borderColor: "var(--border-color)",
            }}
          >
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" style={{ color: "var(--subtitle-color)", flexShrink: 0 }}>
              <path d="M18.38 18.37L14.75 14.75M16.71 10.04C16.71 13.72 13.73 16.71 10.05 16.71C6.36 16.71 3.38 13.72 3.38 10.04C3.38 6.36 6.36 3.37 10.05 3.37C13.73 3.37 16.71 6.36 16.71 10.04Z"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search Surah"
              aria-label="Search Surah"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-[15px] font-light outline-none"
              style={{ color: "var(--pure-color)" }}
            />
          </div>
        </div>

        {/* Surah list */}
        <div className="flex-1 overflow-y-auto pb-4 flex flex-col gap-0">
          {filtered.map((surah) => {
            const isActive = surah.surahNo === activeSurahNo;
            return (
              <div key={surah.surahNo} className="block pb-2 px-[26px]">
                <Link
                  href={`/surah/${surah.surahNo}`}
                  ref={isActive ? activeRef : null}
                  className={`group/card flex w-full min-w-[200px] cursor-pointer select-none items-center justify-between gap-5 rounded-md border px-4 h-[76px] transition-colors${isActive ? " active" : ""}`}
                  style={{
                    borderColor: isActive ? "rgba(61,140,79,0.3)" : "var(--border-color)",
                    backgroundColor: isActive ? "var(--primary-7)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--primary-7)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                  }}
                >
                  {/* Diamond badge */}
                  <div className="relative flex size-8 min-h-8 min-w-8 items-center justify-center shrink-0">
                    <div
                      className="absolute inset-0 rotate-45 rounded-[6px] transition-colors"
                      style={{
                        backgroundColor: isActive ? "var(--primary)" : "var(--secondary-bg)",
                        border: isActive ? "none" : "1px solid var(--border-color)",
                      }}
                    />
                    <span
                      className="relative z-10 text-[13px] font-medium"
                      style={{ color: isActive ? "white" : "var(--subtitle-color)" }}
                    >
                      {surah.surahNo}
                    </span>
                  </div>

                  {/* Name + translation */}
                  <div className="flex-grow text-start w-1/2">
                    <p
                      className="line-clamp-1 break-all pr-3 text-[15px] font-medium"
                      style={{ color: "var(--pure-color)" }}
                    >
                      {surah.surahName}
                    </p>
                    <p
                      className="line-clamp-1 break-all text-[13px] font-normal"
                      style={{ color: "var(--subtitle-color-secondary)" }}
                    >
                      {surah.surahNameTranslation}
                    </p>
                  </div>

                  {/* Arabic name */}
                  <span
                    className="text-right text-[1.25rem] shrink-0"
                    style={{
                      fontFamily: "var(--font-arabic)",
                      color: "var(--subtitle-color)",
                    }}
                  >
                    {surah.surahNameArabic}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}