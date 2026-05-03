"use client";

import type { CSSProperties } from "react";
import { useAudio } from "@/hooks/useAudio";

export function SurahAudioPlayer() {
  const {
    currentTrack,
    status,
    currentTime,
    duration,
    isPlayerVisible,
    isContinuous,
    toggle,
    next,
    previous,
    seek,
    toggleContinuous,
    closePlayer,
  } = useAudio();

  if (!isPlayerVisible || !currentTrack) {
    return null;
  }

  const isPlaying = status === "playing";
  const isLoading = status === "loading";
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[70] border-t border-[var(--border-color)] bg-[var(--secondary-bg)]"
      style={{ height: "58px" }}
    >
      <div className="relative h-full">
        <input
          aria-label="Audio progress"
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={(event) => seek(Number(event.target.value))}
          className="audio-progress-range absolute left-0 right-0 top-0 h-[4px] w-full cursor-pointer"
          style={
            {
              "--audio-progress": `${progress}%`,
            } as CSSProperties
          }
        />

        <div className="flex h-full items-center justify-center px-6">
          <div className="absolute left-[64px] flex min-w-[180px] flex-col justify-center">
            <p className="line-clamp-1 text-[13px] font-semibold text-[var(--pure-color)]">
              {currentTrack.label}
            </p>
          </div>

          <div className="flex items-center gap-7">
            <span className="w-[52px] text-right text-[13px] text-[var(--subtitle-color)]">
              {formatTime(currentTime)}
            </span>

            <PlayerButton label="Previous ayah" onClick={() => void previous()}>
              <PreviousIcon />
            </PlayerButton>

            <button
              type="button"
              aria-label={isPlaying ? "Pause audio" : "Play audio"}
              onClick={() => void toggle()}
              className="flex size-9 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-fg)] transition-transform active:scale-95"
            >
              {isLoading ? (
                <SpinnerIcon className="h-5 w-5 animate-spin" />
              ) : isPlaying ? (
                <PauseIcon />
              ) : (
                <PlayIcon />
              )}
            </button>

            <PlayerButton label="Next ayah" onClick={() => void next()}>
              <NextIcon />
            </PlayerButton>

            <button
              type="button"
              aria-label={
                isContinuous
                  ? "Disable continuous playback"
                  : "Enable continuous playback"
              }
              onClick={toggleContinuous}
              className="rounded-full px-3 py-1 text-[12px] font-semibold transition-colors"
              style={{
                backgroundColor: isContinuous
                  ? "var(--primary)"
                  : "var(--primary-7)",
                color: isContinuous
                  ? "var(--primary-fg)"
                  : "var(--subtitle-color)",
              }}
            >
              Auto
            </button>

            <PlayerButton label="Close audio player" onClick={closePlayer}>
              <CloseIcon />
            </PlayerButton>

            <span className="w-[62px] text-left text-[13px] text-[var(--subtitle-color)]">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayerButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="text-[var(--icon-color)] transition-colors hover:text-[var(--pure-color)]"
    >
      {children}
    </button>
  );
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "00:00";
  }

  const rounded = Math.floor(seconds);
  const minutes = Math.floor(rounded / 60);
  const remainingSeconds = rounded % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M6 4.5L13.5 9L6 13.5V4.5Z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M6.5 4.5V13.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M11.5 4.5V13.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PreviousIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path d="M19 5L9 12L19 19V5Z" fill="currentColor" />
      <path
        d="M5 5V19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path d="M5 5L15 12L5 19V5Z" fill="currentColor" />
      <path
        d="M19 5V19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
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
        d="M12 3a9 9 0 1 1-8.485 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}