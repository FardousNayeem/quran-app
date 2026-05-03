"use client";

import { DEFAULT_RECITER_ID } from "@/lib/constants";
import { useAudio, type AudioQueueItem } from "@/hooks/useAudio";

interface AyahAudioButtonProps {
  queue: AudioQueueItem[];
  index: number;
  reciterId?: string;
}

export function AyahAudioButton({
  queue,
  index,
  reciterId = DEFAULT_RECITER_ID,
}: AyahAudioButtonProps) {
  const { activeKey, status, playQueue } = useAudio();

  const item = queue[index];
  const isActive = item?.key === activeKey;
  const isLoading = isActive && status === "loading";
  const isPlaying = isActive && status === "playing";

  async function handleClick() {
    await playQueue({
      queue,
      startIndex: index,
      reciterId,
    });
  }

  return (
    <button
      type="button"
      aria-label={isPlaying ? "Pause ayah audio" : "Play ayah audio"}
      onClick={handleClick}
      className="ayah-action-tooltip group relative flex size-[34px] min-w-[34px] cursor-pointer items-center justify-center rounded-full bg-transparent text-[var(--icon-color)] transition-colors active:scale-90 hover:bg-[var(--primary-7)] hover:text-[var(--pure-color)]"
    >
      <span className="ayah-action-tooltip-label">Play</span>

      {isLoading ? (
        <SpinnerIcon className="h-[18px] w-[18px] animate-spin" />
      ) : isPlaying ? (
        <PauseIcon className="h-[18px] w-[18px]" />
      ) : (
        <PlayIcon className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 9.00004V6.33004C3 3.01504 5.3475 1.65754 8.22 3.31504L10.5375 4.65004L12.855 5.98504C15.7275 7.64254 15.7275 10.3575 12.855 12.015L10.5375 13.35L8.22 14.685C5.3475 16.3425 3 14.985 3 11.67V9.00004Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6.375 3.75V14.25"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M11.625 3.75V14.25"
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