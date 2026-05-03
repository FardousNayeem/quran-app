"use client";

import { useEffect, useState } from "react";
import type { FontSettings } from "@/types/quran.types";
import {
  DEFAULT_FONT_SETTINGS,
  FONT_SETTINGS_KEY,
  ARABIC_FONTS,
  TRANSLATION_FONTS,
} from "@/lib/constants";

function readStoredSettings(): FontSettings {
  if (typeof window === "undefined") {
    return DEFAULT_FONT_SETTINGS;
  }

  try {
    const saved = window.localStorage.getItem(FONT_SETTINGS_KEY);

    if (!saved) {
      return DEFAULT_FONT_SETTINGS;
    }

    return {
      ...DEFAULT_FONT_SETTINGS,
      ...(JSON.parse(saved) as Partial<FontSettings>),
    };
  } catch {
    return DEFAULT_FONT_SETTINGS;
  }
}

function applyToDOM(settings: FontSettings) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const arabicFont = ARABIC_FONTS.find((font) => font.id === settings.arabicFont);
  const translationFont = TRANSLATION_FONTS.find(
    (font) => font.id === settings.translationFont
  );

  root.style.setProperty("--font-arabic", arabicFont?.cssVar ?? "serif");
  root.style.setProperty("--font-translation", translationFont?.cssVar ?? "sans-serif");
  root.style.setProperty("--arabic-font-size", `${settings.arabicSize}px`);
  root.style.setProperty("--translation-font-size", `${settings.translationSize}px`);
}

export function useFontSettings() {
  // Always start with the same value on server and client
  const [settings, setSettings] = useState<FontSettings>(DEFAULT_FONT_SETTINGS);
  const [hasLoadedStoredSettings, setHasLoadedStoredSettings] = useState(false);

  useEffect(() => {
    const stored = readStoredSettings();
    setSettings(stored);
    setHasLoadedStoredSettings(true);
  }, []);

  useEffect(() => {
    applyToDOM(settings);
  }, [settings]);

  const update = (partial: Partial<FontSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };

      try {
        window.localStorage.setItem(FONT_SETTINGS_KEY, JSON.stringify(next));
      } catch {
        // ignore localStorage errors
      }

      return next;
    });
  };

  return {
    settings,
    update,
    hasLoadedStoredSettings,
  };
}