/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { SurahMeta } from "@/types/quran.types";
import { displaySurahName } from "@/lib/quran.helpers";

interface JumpToAyahModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  surahs: SurahMeta[];
  activeSurahNo: number;
}

export function JumpToAyahModal({
  open,
  onOpenChange,
  surahs,
  activeSurahNo,
}: JumpToAyahModalProps) {
  const router = useRouter();

  const activeSurah = useMemo(() => {
    return (
      surahs.find((surah) => surah.surahNo === activeSurahNo) ??
      surahs[0] ??
      null
    );
  }, [activeSurahNo, surahs]);

  const [selectedSurahNo, setSelectedSurahNo] = useState(activeSurahNo);
  const [selectedAyahNo, setSelectedAyahNo] = useState(1);

  const selectedSurah = useMemo(() => {
    return (
      surahs.find((surah) => surah.surahNo === selectedSurahNo) ??
      activeSurah
    );
  }, [activeSurah, selectedSurahNo, surahs]);

  useEffect(() => {
    if (!open) return;

    setSelectedSurahNo(activeSurahNo);
    setSelectedAyahNo(1);
  }, [activeSurahNo, open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!selectedSurah) return;

    if (selectedAyahNo > selectedSurah.totalAyah) {
      setSelectedAyahNo(selectedSurah.totalAyah);
    }
  }, [selectedAyahNo, selectedSurah]);

  if (!open || !selectedSurah) {
    return null;
  }

  const ayahOptions = Array.from(
    { length: selectedSurah.totalAyah },
    (_, index) => index + 1
  );

  function scrollCurrentPage(hash: string) {
    window.history.replaceState(null, "", `#${hash}`);

    window.requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function jumpToAyah() {
    const hash = `ayah-${selectedSurahNo}:${selectedAyahNo}`;

    onOpenChange(false);

    if (selectedSurahNo === activeSurahNo) {
      scrollCurrentPage(hash);
      return;
    }

    router.push(`/surah/${selectedSurahNo}#${hash}`);
  }

  function jumpToTafsir() {
    //Will Implement Someday
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Jump to Ayah or Tafsir"
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 px-4"
      onMouseDown={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-[600px] overflow-hidden rounded-[16px] border border-[var(--border-color)] bg-[var(--secondary-bg)] shadow-[0_24px_90px_rgba(0,0,0,0.65)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="px-7 pb-9 pt-8">
          <h2 className="text-center text-[20px] font-bold text-[var(--pure-color)]">
            Jump to Ayah/Tafsir
          </h2>

          <div className="mt-8 space-y-7">
            <div className="space-y-3">
              <label
                htmlFor="jump-surah"
                className="block text-[15px] font-semibold text-[var(--pure-color)]"
              >
                Select Surah
              </label>

              <div className="relative">
                <select
                  id="jump-surah"
                  value={selectedSurahNo}
                  onChange={(event) => {
                    setSelectedSurahNo(Number(event.target.value));
                    setSelectedAyahNo(1);
                  }}
                  className="h-12 w-full appearance-none rounded-[8px] border border-transparent bg-[var(--primary-bg)] px-4 pr-10 text-[15px] font-medium text-[var(--pure-color)] outline-none transition-colors hover:border-[var(--border-color)] focus:border-[rgba(66,128,56,0.55)]"
                >
                  {surahs.map((surah) => (
                    <option key={surah.surahNo} value={surah.surahNo}>
                      {displaySurahName(surah.surahName)}
                    </option>
                  ))}
                </select>

                <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--subtitle-color)]" />
              </div>
            </div>

            <div className="space-y-3">
              <label
                htmlFor="jump-ayah"
                className="block text-[15px] font-semibold text-[var(--pure-color)]"
              >
                Select Ayah
              </label>

              <div className="relative">
                <select
                  id="jump-ayah"
                  value={selectedAyahNo}
                  onChange={(event) =>
                    setSelectedAyahNo(Number(event.target.value))
                  }
                  className="h-12 w-full appearance-none rounded-[8px] border border-transparent bg-[var(--primary-bg)] px-4 pr-10 text-[15px] font-medium text-[var(--pure-color)] outline-none transition-colors hover:border-[var(--border-color)] focus:border-[rgba(66,128,56,0.55)]"
                >
                  {ayahOptions.map((ayahNo) => (
                    <option key={ayahNo} value={ayahNo}>
                      {String(ayahNo).padStart(2, "0")} -{" "}
                      {selectedSurah.totalAyah}
                    </option>
                  ))}
                </select>

                <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--subtitle-color)]" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid h-[64px] grid-cols-2 border-t border-[var(--border-color)]">
          <button
            type="button"
            onClick={jumpToTafsir}
            className="bg-[var(--primary-bg)] text-[15px] font-semibold text-[var(--pure-color)] transition-colors hover:bg-[var(--primary-7)]"
          >
            Jump To Tafsir
          </button>

          <button
            type="button"
            onClick={jumpToAyah}
            className="bg-[var(--primary)] text-[15px] font-semibold text-[var(--primary-fg)] transition-opacity hover:opacity-90"
          >
            Jump To Ayah
          </button>
        </div>
      </div>
    </div>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      width="15"
      height="14"
      viewBox="0 0 15 14"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M11.8181 5.22095L8.01479 9.02428C7.56562 9.47345 6.83063 9.47345 6.38146 9.02428L2.57812 5.22095"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}