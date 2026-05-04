"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SurahMeta } from "@/types/quran.types";
import {
  displaySurahArabicName,
  displaySurahName,
  displaySurahTranslation,
} from "@/lib/quran.helpers";

interface Props {
  surahs: SurahMeta[];
  variant?: "fixed" | "drawer";
  open?: boolean;
  onClose?: () => void;
}

const TABS = ["Surah", "Juz", "Page"] as const;

function getActiveSurahFromPath(pathname: string): number {
  const match = pathname.match(/\/surah\/(\d+)/);
  return match ? Number(match[1]) : 1;
}

export function SurahSidebar({
  surahs,
  variant = "fixed",
  open = false,
  onClose,
}: Props) {
  const pathname = usePathname();
  const activeSurahNo = getActiveSurahFromPath(pathname);

  const [tab, setTab] = useState<(typeof TABS)[number]>("Surah");
  const [query, setQuery] = useState("");
  const activeRef = useRef<HTMLAnchorElement>(null);

  const activeIdx = TABS.indexOf(tab);
  const isDrawer = variant === "drawer";

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

  if (isDrawer) {
    return (
      <>
        <div
          className={`surah-drawer-backdrop ${open ? "surah-drawer-backdrop-open" : ""}`}
          onClick={onClose}
          aria-hidden="true"
        />

        <aside
          aria-label="Surah navigation drawer"
          className={`surah-sidebar-drawer ${open ? "surah-sidebar-drawer-open" : ""}`}
        >
          <DrawerHeader onClose={onClose} />
          <SurahSidebarContent
            tab={tab}
            setTab={setTab}
            activeIdx={activeIdx}
            query={query}
            setQuery={setQuery}
            filteredSurahs={filteredSurahs}
            activeSurahNo={activeSurahNo}
            activeRef={activeRef}
            onNavigate={onClose}
          />
        </aside>
      </>
    );
  }

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
      <SurahSidebarContent
        tab={tab}
        setTab={setTab}
        activeIdx={activeIdx}
        query={query}
        setQuery={setQuery}
        filteredSurahs={filteredSurahs}
        activeSurahNo={activeSurahNo}
        activeRef={activeRef}
      />
    </aside>
  );
}

function DrawerHeader({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex h-[72px] items-center justify-between border-b border-[var(--border-color)] px-4">
      <Link href="/" className="flex items-center gap-3">
        <LogoMini />
        <div className="select-none">
          <p className="font-latin text-xl font-bold leading-none text-[var(--pure-color)]">
            Quran Mazid
          </p>
          <p className="mt-[3px] text-[10px] tracking-tight text-[var(--subtitle-color)]">
            Read, Study, and Learn The Quran
          </p>
        </div>
      </Link>

      <button
        type="button"
        aria-label="Close surah menu"
        onClick={onClose}
        className="flex size-9 items-center justify-center rounded-full text-[var(--icon-color)] hover:bg-[var(--primary-7)] hover:text-[var(--pure-color)]"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

function SurahSidebarContent({
  tab,
  setTab,
  activeIdx,
  query,
  setQuery,
  filteredSurahs,
  activeSurahNo,
  activeRef,
  onNavigate,
}: {
  tab: (typeof TABS)[number];
  setTab: (tab: (typeof TABS)[number]) => void;
  activeIdx: number;
  query: string;
  setQuery: (value: string) => void;
  filteredSurahs: SurahMeta[];
  activeSurahNo: number;
  activeRef: React.RefObject<HTMLAnchorElement | null>;
  onNavigate?: () => void;
}) {
  return (
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
                prefetch
                onClick={onNavigate}
                className="group/card flex h-[76px] w-full min-w-[200px] cursor-pointer select-none items-center justify-between gap-5 rounded-xl border px-4 font-semibold transition-colors duration-200 hover:bg-[var(--primary-7)]"
                style={{
                  borderColor: isActive
                    ? "rgba(66,128,56,0.32)"
                    : "var(--border-color)",
                  backgroundColor: isActive ? "var(--primary-7)" : "transparent",
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
                  dir="rtl"
                  className="block max-w-[78px] shrink-0 truncate text-right text-lg leading-none"
                  style={{
                    color: "var(--subtitle-color)",
                    fontFamily:
                      "var(--font-calligraphy), var(--font-arabic), Amiri, serif",
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
  );
}

function DiamondBadge({ number, active }: { number: number; active: boolean }) {
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
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" className={className} aria-hidden="true">
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

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LogoMini() {
  return (
    <span className="flex size-9 items-center justify-center rounded-[8px] bg-[var(--primary)] text-white">
      <svg width="23" height="23" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <path
          d="M17.5806 24.1443C17.5806 24.3736 17.77 24.5591 17.9986 24.5591V25.5405L9.92986 22.0383L8.60099 21.4623C8.29824 21.3311 8.04048 21.1142 7.85944 20.8383C7.6784 20.5624 7.58197 20.2396 7.58203 19.9096V9.37417C7.58187 9.09963 7.64851 8.82918 7.7762 8.58615C7.9039 8.34312 8.08881 8.13482 8.31498 7.97921C8.54116 7.8236 8.8018 7.72536 9.07441 7.69297C9.34703 7.66058 9.62343 7.69501 9.87977 7.7933L17.9986 10.9026V11.884C17.8883 11.884 17.7824 11.9276 17.7041 12.0053C17.6259 12.083 17.5815 12.1885 17.5806 12.2988V24.1436V24.1443Z"
          fill="white"
        />
        <path
          d="M28.0252 9.37374V19.9095C28.0252 20.4269 27.7175 20.8958 27.2417 21.1032L25.9131 21.6791L18.3913 24.9439V24.8493C18.4568 24.8131 18.517 24.7678 18.5702 24.7147C18.6452 24.6398 18.7048 24.5509 18.7454 24.453C18.786 24.3551 18.8069 24.2501 18.8069 24.1441V12.2986C18.8069 12.0848 18.7219 11.8798 18.5708 11.7286C18.5173 11.6751 18.4571 11.6299 18.3921 11.5938V11.1708L26.2587 8.15774C26.4559 8.08214 26.6684 8.05567 26.878 8.08056C27.0875 8.10546 27.2879 8.18098 27.4618 8.3006C27.6356 8.42023 27.7778 8.58036 27.876 8.76718C27.974 8.95384 28.0253 9.16251 28.0252 9.37374Z"
          fill="#E2E2E2"
        />
      </svg>
    </span>
  );
}