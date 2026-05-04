/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAudio, type AudioQueueItem } from "@/hooks/useAudio";

interface AyahMoreMenuProps {
  surahNo: number;
  ayahNo: number;
  surahName: string;
  arabic: string;
  english: string;
  variant?: "dropdown" | "sheet";
  queue?: AudioQueueItem[];
  audioIndex?: number;
}

export function AyahMoreMenu({
  surahNo,
  ayahNo,
  surahName,
  arabic,
  english,
  variant = "dropdown",
  queue,
  audioIndex,
}: AyahMoreMenuProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<"ayah" | "link" | "share" | null>(null);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { playQueue } = useAudio();

  const ayahReference = `${surahNo}:${ayahNo}`;
  const sourceUrl = `https://quranmazid.com/${surahNo}/${ayahNo}`;

  const copyText = `${arabic}

[Saheeh International] ${english}

Al-Quran: ${surahName} (${ayahReference})
Source: ${sourceUrl}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || variant !== "dropdown") return;

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
  }, [open, variant]);

  useEffect(() => {
    if (!open || variant !== "sheet") return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, variant]);

  useEffect(() => {
    if (!copied) return;

    const timer = window.setTimeout(() => {
      setCopied(null);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [copied]);

  async function handlePlay() {
    if (!queue || audioIndex === undefined) return;

    await playQueue({
      queue,
      startIndex: audioIndex,
    });

    setOpen(false);
  }

  async function copyAyah() {
    await navigator.clipboard.writeText(copyText);
    setCopied("ayah");
  }

  async function copyLink() {
    await navigator.clipboard.writeText(sourceUrl);
    setCopied("link");
  }

  async function shareAyah() {
    if (navigator.share) {
      await navigator.share({
        title: `Al-Quran: ${surahName} (${ayahReference})`,
        text: copyText,
        url: sourceUrl,
      });
      setCopied("share");
      return;
    }

    await navigator.clipboard.writeText(copyText);
    setCopied("share");
  }

  const sheet =
    mounted && open && variant === "sheet"
      ? createPortal(
          <div className="fixed inset-0 z-[9999] md:hidden">
            <button
              type="button"
              aria-label="Close ayah actions"
              className="absolute inset-0 bg-black/70"
              onClick={() => setOpen(false)}
            />

            <div
              role="dialog"
              aria-modal="true"
              aria-label="Ayah actions"
              className="absolute inset-x-0 bottom-0 z-[10000] rounded-t-[24px] border-t border-[var(--border-color)] bg-[var(--secondary-bg)] px-4 pb-[max(28px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-18px_60px_rgba(0,0,0,0.55)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mx-auto mb-3 h-1 w-11 rounded-full bg-[var(--border-color)]" />

              <div className="space-y-1">
                <SheetButton
                  icon={<PlayIcon className="h-5 w-5" />}
                  label="Play"
                  onClick={() => void handlePlay()}
                />

                <SheetButton
                  icon={<BookIcon className="h-5 w-5" />}
                  label="Tafsir"
                  onClick={() => setOpen(false)}
                />

                <SheetButton
                  icon={<BookmarkIcon className="h-5 w-5" />}
                  label="Bookmark"
                  onClick={() => setOpen(false)}
                />

                <SheetButton
                  icon={<CopyIcon className="h-5 w-5" />}
                  label={copied === "ayah" ? "Copied" : "Ayah Copy"}
                  onClick={() => void copyAyah()}
                />

                <SheetButton
                  icon={<LinkIcon className="h-5 w-5" />}
                  label={copied === "link" ? "Copied" : "Copy Link"}
                  onClick={() => void copyLink()}
                />

                <SheetButton
                  icon={<ShareIcon className="h-5 w-5" />}
                  label={copied === "share" ? "Shared" : "Ayah Share"}
                  onClick={() => void shareAyah()}
                />
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <div ref={menuRef} className="relative z-0">
      <button
        type="button"
        aria-label="More ayah actions"
        aria-haspopup={variant === "sheet" ? "dialog" : "menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="ayah-action-tooltip group relative flex size-[34px] min-w-[34px] cursor-pointer items-center justify-center rounded-full bg-transparent text-[var(--icon-color)] transition-colors active:scale-90 hover:bg-[var(--primary-7)] hover:text-[var(--pure-color)]"
      >
        {variant === "dropdown" && (
          <span className="ayah-action-tooltip-label">More</span>
        )}
        <MoreIcon className="h-5 w-5" />
      </button>

      {open && variant === "dropdown" && (
        <div
          role="menu"
          className="absolute left-[42px] top-0 z-[60] min-w-[150px] overflow-hidden rounded-[10px] border border-[var(--border-color)] bg-[var(--secondary-bg)] p-1 shadow-[0_18px_45px_rgba(0,0,0,0.55)]"
        >
          <MenuButton
            icon={<CopyIcon className="h-4 w-4 shrink-0" />}
            label={copied === "ayah" ? "Copied" : "Copy Ayah"}
            onClick={() => void copyAyah()}
          />

          <MenuButton
            icon={<LinkIcon className="h-4 w-4 shrink-0" />}
            label={copied === "link" ? "Copied" : "Copy Link"}
            onClick={() => void copyLink()}
          />
        </div>
      )}

      {sheet}
    </div>
  );
}

function MenuButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-[8px] px-3 py-2.5 text-left text-[13px] font-medium text-[var(--pure-color)] transition-colors hover:bg-[var(--primary-7)] hover:text-[var(--primary)]"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function SheetButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[56px] w-full items-center gap-4 rounded-[12px] px-4 text-left text-[16px] font-medium text-[var(--pure-color)] transition-colors active:scale-[0.99] hover:bg-[var(--primary-7)]"
    >
      <span className="flex size-8 items-center justify-center text-[var(--icon-color)]">
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}

function MoreIcon({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
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

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 9V6.33C3 3.015 5.347 1.658 8.22 3.315L10.538 4.65L12.855 5.985C15.728 7.643 15.728 10.358 12.855 12.015L10.538 13.35L8.22 14.685C5.347 16.343 3 14.985 3 11.67V9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className={className} aria-hidden="true">
      <path
        d="M20.1673 15.3449V4.28072C20.1673 3.18072 19.269 2.36489 18.1782 2.45655H18.1232C16.1982 2.62155 13.274 3.60239 11.6423 4.62906L11.4865 4.72989C11.2207 4.89489 10.7807 4.89489 10.5148 4.72989L10.2857 4.59239C8.65398 3.57489 5.73898 2.60322 3.81398 2.44739C2.72315 2.35572 1.83398 3.18072 1.83398 4.27155V15.3449C1.83398 16.2249 2.54898 17.0499 3.42898 17.1599L3.69482 17.1966C5.68398 17.4624 8.75482 18.4707 10.5148 19.4332L10.5515 19.4516C10.799 19.5891 11.1932 19.5891 11.4315 19.4516C13.1915 18.4799 16.2715 17.4624 18.2698 17.1966L18.5723 17.1599C19.4523 17.0499 20.1673 16.2249 20.1673 15.3449Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11 5.03247V18.7825" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="none" className={className} aria-hidden="true">
      <path
        d="M1.64453 13.7513V7.17862C1.64453 4.29211 1.64453 2.84886 2.57528 1.95214C3.50603 1.05542 5.00405 1.05542 8.00009 1.05542C10.9961 1.05542 12.4942 1.05542 13.4249 1.95214C14.3556 2.84886 14.3556 4.29211 14.3556 7.17862V13.7513C14.3556 15.5832 14.3556 16.4991 13.7417 16.827C12.5527 17.4618 10.3224 15.3437 9.26325 14.7059C8.64899 14.336 8.34186 14.151 8.00009 14.151C7.65832 14.151 7.35118 14.336 6.73692 14.7059C5.67777 15.3437 3.4475 17.4618 2.25852 16.827C1.64453 16.4991 1.64453 15.5832 1.64453 13.7513Z"
        stroke="currentColor"
        strokeWidth="1.38569"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M1.64453 5.02588H14.3556" stroke="currentColor" strokeWidth="1.38569" strokeLinecap="round" />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M10 13.5L14 9.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
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

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M18 8a3 3 0 1 0-2.83-4M6 14a3 3 0 1 0 0-4a3 3 0 0 0 0 4ZM18 20a3 3 0 1 0-2.83-4M8.6 13.1l6.8 3.8M15.4 7.1L8.6 10.9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}