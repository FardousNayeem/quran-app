"use client";

import { useEffect, useRef, useState } from "react";

interface AyahMoreMenuProps {
  surahNo: number;
  ayahNo: number;
  surahName: string;
  arabic: string;
  english: string;
}

export function AyahMoreMenu({
  surahNo,
  ayahNo,
  surahName,
  arabic,
  english,
}: AyahMoreMenuProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<"ayah" | "link" | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const ayahReference = `${surahNo}:${ayahNo}`;
  const sourceUrl = `https://quranmazid.com/${surahNo}/${ayahNo}`;

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!copied) return;

    const timer = window.setTimeout(() => {
      setCopied(null);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copyAyah() {
    const text = `${arabic}

[Saheeh International] ${english}

Al-Quran: ${surahName} (${ayahReference})
Source: ${sourceUrl}`;

    await navigator.clipboard.writeText(text);
    setCopied("ayah");
  }

  async function copyLink() {
    await navigator.clipboard.writeText(sourceUrl);
    setCopied("link");
  }

  return (
    <div ref={menuRef} className="relative z-[80]">
      <button
        type="button"
        aria-label="More ayah actions"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="ayah-action-tooltip group relative flex size-[34px] min-w-[34px] cursor-pointer items-center justify-center rounded-full bg-transparent text-[var(--icon-color)] transition-colors active:scale-90 hover:bg-[var(--primary-7)] hover:text-[var(--pure-color)]"
      >
        <span className="ayah-action-tooltip-label">More</span>
        <MoreIcon className="h-5 w-5" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-[42px] top-0 z-[999] min-w-[150px] overflow-hidden rounded-[10px] border border-[var(--border-color)] bg-[var(--secondary-bg)] p-1 shadow-[0_18px_45px_rgba(0,0,0,0.55)]"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => void copyAyah()}
            className="flex w-full items-center gap-2 rounded-[8px] px-3 py-2.5 text-left text-[13px] font-medium text-[var(--pure-color)] transition-colors hover:bg-[var(--primary-7)] hover:text-[var(--primary)]"
          >
            <CopyIcon className="h-4 w-4 shrink-0" />
            <span>{copied === "ayah" ? "Copied" : "Copy Ayah"}</span>
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => void copyLink()}
            className="flex w-full items-center gap-2 rounded-[8px] px-3 py-2.5 text-left text-[13px] font-medium text-[var(--pure-color)] transition-colors hover:bg-[var(--primary-7)] hover:text-[var(--primary)]"
          >
            <LinkIcon className="h-4 w-4 shrink-0" />
            <span>{copied === "link" ? "Copied" : "Copy Link"}</span>
          </button>
        </div>
      )}
    </div>
  );
}

function MoreIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M5 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0m5 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0m5 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
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
        d="M8 8.5C8 6.62 8 5.67 8.59 5.09C9.17 4.5 10.12 4.5 12 4.5H15.5C17.38 4.5 18.33 4.5 18.91 5.09C19.5 5.67 19.5 6.62 19.5 8.5V12C19.5 13.88 19.5 14.83 18.91 15.41C18.33 16 17.38 16 15.5 16H12C10.12 16 9.17 16 8.59 15.41C8 14.83 8 13.88 8 12V8.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M6 8.1C5.43 8.18 5.04 8.34 4.73 8.65C4 9.38 4 10.55 4 12.9V15C4 17.36 4 18.54 4.73 19.27C5.46 20 6.64 20 9 20H11.1C13.45 20 14.62 20 15.35 19.27C15.66 18.96 15.82 18.57 15.9 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
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
        d="M10 13.5L14 9.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M8.5 9.5L7.75 10.25C6.37 11.63 6.37 13.87 7.75 15.25C9.13 16.63 11.37 16.63 12.75 15.25L13.5 14.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M15.5 14.5L16.25 13.75C17.63 12.37 17.63 10.13 16.25 8.75C14.87 7.37 12.63 7.37 11.25 8.75L10.5 9.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}