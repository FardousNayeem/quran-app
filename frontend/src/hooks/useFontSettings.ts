"use client";

import { useEffect, useState } from "react";
import type { FontSettings } from "@/types/quran.types";
import {
  DEFAULT_FONT_SETTINGS,
  FONT_SETTINGS_KEY,
  ARABIC_FONTS,
  TRANSLATION_FONTS,
} from "@/lib/constants";

function getInitialSettings(): FontSettings {
  if (typeof window === "undefined") {
    return DEFAULT_FONT_SETTINGS;
  }

  try {
    const saved = window.localStorage.getItem(FONT_SETTINGS_KEY);
    return saved
      ? { ...DEFAULT_FONT_SETTINGS, ...(JSON.parse(saved) as Partial<FontSettings>) }
      : DEFAULT_FONT_SETTINGS;
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
  root.style.setProperty("--arabic-font-size", `${settings.arabicSize}rem`);
  root.style.setProperty("--translation-font-size", `${settings.translationSize}rem`);
}

export function useFontSettings() {
  const [settings, setSettings] = useState<FontSettings>(getInitialSettings);

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

  return { settings, update };
}