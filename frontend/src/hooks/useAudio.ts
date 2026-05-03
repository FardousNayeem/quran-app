"use client";

import { useCallback, useSyncExternalStore } from "react";
import { fetchAyahAudio } from "@/lib/api.client";
import { DEFAULT_RECITER_ID } from "@/lib/constants";
import { pickAudioSource } from "@/lib/quran.helpers";
import type { ReciterMap } from "@/types/quran.types";

export type AudioStatus =
  | "idle"
  | "loading"
  | "playing"
  | "paused"
  | "ended"
  | "error";

export interface AudioQueueItem {
  key: string;
  surahNo: number;
  ayahNo: number;
  label: string;
  audio?: ReciterMap;
  src?: string;
}

interface AudioState {
  queue: AudioQueueItem[];
  currentIndex: number;
  activeKey: string | null;
  status: AudioStatus;
  error: string | null;
  duration: number;
  currentTime: number;
  isPlayerVisible: boolean;
}

let currentAudio: HTMLAudioElement | null = null;

let audioState: AudioState = {
  queue: [],
  currentIndex: -1,
  activeKey: null,
  status: "idle",
  error: null,
  duration: 0,
  currentTime: 0,
  isPlayerVisible: false,
};

const SERVER_AUDIO_STATE: AudioState = {
  queue: [],
  currentIndex: -1,
  activeKey: null,
  status: "idle",
  error: null,
  duration: 0,
  currentTime: 0,
  isPlayerVisible: false,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function setAudioState(next: Partial<AudioState>) {
  audioState = {
    ...audioState,
    ...next,
  };

  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return audioState;
}

function getServerSnapshot() {
  return SERVER_AUDIO_STATE;
}

function detachAndStopCurrentAudio() {
  if (!currentAudio) return;

  currentAudio.pause();
  currentAudio.src = "";
  currentAudio.load();
  currentAudio = null;
}

function formatAudioError() {
  return "Audio failed to load.";
}

async function resolveTrackSrc(
  item: AudioQueueItem,
  reciterId: string
): Promise<string | null> {
  if (item.src) {
    return item.src;
  }

  const bundledSource = item.audio
    ? pickAudioSource(item.audio, reciterId)
    : null;

  if (bundledSource?.url) {
    return bundledSource.url;
  }

  const fetchedAudio = await fetchAyahAudio(item.surahNo, item.ayahNo);
  const fetchedSource = pickAudioSource(fetchedAudio, reciterId);

  return fetchedSource?.url ?? null;
}

async function playQueueIndex(index: number, reciterId = DEFAULT_RECITER_ID) {
  const item = audioState.queue[index];

  if (!item) {
    setAudioState({
      status: "ended",
      currentIndex: -1,
      activeKey: null,
      currentTime: 0,
      duration: 0,
    });

    return;
  }

  detachAndStopCurrentAudio();

  setAudioState({
    currentIndex: index,
    activeKey: item.key,
    status: "loading",
    error: null,
    currentTime: 0,
    duration: 0,
    isPlayerVisible: true,
  });

  let src: string | null = null;

  try {
    src = await resolveTrackSrc(item, reciterId);
  } catch {
    setAudioState({
      status: "error",
      error: formatAudioError(),
    });

    return;
  }

  if (!src) {
    setAudioState({
      status: "error",
      error: "Audio source is missing.",
    });

    return;
  }

  const audio = new Audio(src);
  currentAudio = audio;

  audio.addEventListener("loadedmetadata", () => {
    if (currentAudio !== audio) return;

    setAudioState({
      duration: Number.isFinite(audio.duration) ? audio.duration : 0,
    });
  });

  audio.addEventListener("timeupdate", () => {
    if (currentAudio !== audio) return;

    setAudioState({
      currentTime: audio.currentTime,
      duration: Number.isFinite(audio.duration) ? audio.duration : 0,
    });
  });

  audio.addEventListener("playing", () => {
    if (currentAudio !== audio) return;

    setAudioState({
      status: "playing",
      error: null,
      isPlayerVisible: true,
    });
  });

  audio.addEventListener("pause", () => {
    if (currentAudio !== audio) return;
    if (audio.ended) return;

    setAudioState({
      status: "paused",
    });
  });

  audio.addEventListener("ended", () => {
    if (currentAudio !== audio) return;

    const nextIndex = index + 1;

    if (nextIndex < audioState.queue.length) {
      void playQueueIndex(nextIndex, reciterId);
      return;
    }

    currentAudio = null;

    setAudioState({
      status: "ended",
      currentTime: 0,
    });
  });

  audio.addEventListener("error", () => {
    if (currentAudio !== audio) return;

    currentAudio = null;

    setAudioState({
      status: "error",
      error: formatAudioError(),
    });
  });

  try {
    await audio.play();
  } catch {
    if (currentAudio !== audio) return;

    setAudioState({
      status: "error",
      error: "Unable to play audio.",
    });
  }
}

export function useAudio() {
  const state = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const playQueue = useCallback(
    async ({
      queue,
      startIndex,
      reciterId = DEFAULT_RECITER_ID,
    }: {
      queue: AudioQueueItem[];
      startIndex: number;
      reciterId?: string;
    }) => {
      const item = queue[startIndex];

      if (!item) return;

      const isSameActiveTrack =
        audioState.activeKey === item.key && currentAudio !== null;

      if (isSameActiveTrack) {
        if (
          audioState.status === "playing" ||
          audioState.status === "loading"
        ) {
          currentAudio?.pause();
          setAudioState({ status: "paused" });
          return;
        }

        try {
          setAudioState({
            status: "loading",
            isPlayerVisible: true,
          });

          await currentAudio?.play();

          setAudioState({
            status: "playing",
            isPlayerVisible: true,
          });
        } catch {
          setAudioState({
            status: "error",
            error: "Unable to play audio.",
          });
        }

        return;
      }

      setAudioState({
        queue,
        currentIndex: startIndex,
        activeKey: item.key,
        isPlayerVisible: true,
      });

      await playQueueIndex(startIndex, reciterId);
    },
    []
  );

  const toggle = useCallback(async () => {
    if (!currentAudio) {
      if (audioState.currentIndex >= 0) {
        await playQueueIndex(audioState.currentIndex);
      }

      return;
    }

    if (audioState.status === "playing" || audioState.status === "loading") {
      currentAudio.pause();
      setAudioState({ status: "paused" });
      return;
    }

    try {
      setAudioState({ status: "loading" });
      await currentAudio.play();
      setAudioState({ status: "playing" });
    } catch {
      setAudioState({
        status: "error",
        error: "Unable to play audio.",
      });
    }
  }, []);

  const next = useCallback(async () => {
    const nextIndex = audioState.currentIndex + 1;

    if (nextIndex >= audioState.queue.length) return;

    await playQueueIndex(nextIndex);
  }, []);

  const previous = useCallback(async () => {
    if (currentAudio && currentAudio.currentTime > 3) {
      currentAudio.currentTime = 0;
      setAudioState({ currentTime: 0 });
      return;
    }

    const previousIndex = audioState.currentIndex - 1;

    if (previousIndex < 0) return;

    await playQueueIndex(previousIndex);
  }, []);

  const seek = useCallback((time: number) => {
    if (!currentAudio) return;

    const safeTime = Math.min(
      Math.max(time, 0),
      Number.isFinite(currentAudio.duration) ? currentAudio.duration : time
    );

    currentAudio.currentTime = safeTime;

    setAudioState({
      currentTime: safeTime,
    });
  }, []);

  const closePlayer = useCallback(() => {
    detachAndStopCurrentAudio();

    setAudioState({
      queue: [],
      currentIndex: -1,
      activeKey: null,
      status: "idle",
      error: null,
      duration: 0,
      currentTime: 0,
      isPlayerVisible: false,
    });
  }, []);

  return {
    ...state,
    currentTrack:
      state.currentIndex >= 0 ? state.queue[state.currentIndex] ?? null : null,
    playQueue,
    toggle,
    next,
    previous,
    seek,
    closePlayer,
  };
}