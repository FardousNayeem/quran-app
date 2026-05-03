"use client";

import { useState } from "react";
import type { FontSettings } from "@/types/quran.types";
import { ARABIC_FONTS, ARABIC_SIZE_MIN, ARABIC_SIZE_MAX, TRANSLATION_SIZE_MIN, TRANSLATION_SIZE_MAX } from "@/lib/constants";

interface Props {
  settings: FontSettings;
  onUpdate: (p: Partial<FontSettings>) => void;
}

function AccordionSection({
  isOpen,
  onToggle,
  iconClosed,
  iconOpen,
  label,
  children,
}: {
  isOpen: boolean;
  onToggle: () => void;
  iconClosed: React.ReactNode;
  iconOpen: React.ReactNode;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden">
      <button
        onClick={onToggle}
        className="flex flex-1 items-center py-3 font-medium transition-all w-full px-[26px]"
        style={{ borderBottom: isOpen ? "none" : `1px solid var(--border-color)` }}
      >
        <div className="flex w-full items-center gap-4">
          <span style={{ color: isOpen ? "var(--primary)" : "var(--subtitle-color)" }}>
            {isOpen ? iconOpen : iconClosed}
          </span>
          <p
            className="text-[15px]"
            style={{
              color: isOpen ? "var(--primary)" : "var(--pure-color)",
              fontWeight: isOpen ? 700 : 500,
            }}
          >
            {label}
          </p>
        </div>
        <svg
          width="14" height="11" viewBox="0 0 15 14" fill="none"
          className="shrink-0 transition-all duration-300"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            color: isOpen ? "var(--primary)" : "var(--subtitle-color)",
          }}
        >
          <path d="M11.82 5.22L8.01 9.02C7.57 9.47 6.83 9.47 6.38 9.02L2.58 5.22"
            stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {isOpen && (
        <div className="px-[26px] pb-4 pt-3 space-y-8"
          style={{ borderBottom: `1px solid var(--border-color)` }}>
          {children}
        </div>
      )}
    </div>
  );
}

function RangeSlider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-medium" style={{ color: "var(--pure-color)" }}>{label}</p>
        <p className="text-[13px] font-medium" style={{ color: "var(--primary)" }}>{display}</p>
      </div>
      <div className="relative flex w-full touch-none select-none items-center">
        {/* Track */}
        <div className="relative h-1 w-full grow overflow-hidden rounded-full"
          style={{ backgroundColor: "var(--border-color)" }}>
          <div className="absolute h-full rounded-full"
            style={{ width: `${pct}%`, backgroundColor: "var(--primary)", left: 0 }} />
        </div>
        {/* Thumb */}
        <span
          className="absolute block size-3 rounded-full -translate-x-1/2"
          style={{ left: `${pct}%`, backgroundColor: "var(--primary)" }}
        />
        {/* Native range input (invisible, on top) */}
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          style={{ height: "100%" }}
        />
      </div>
    </div>
  );
}

export function RightPanel({ settings, onUpdate }: Props) {
  const [readingOpen, setReadingOpen] = useState(false);
  const [fontOpen, setFontOpen] = useState(true);

  const tabs = ["Translation", "Reading"] as const;
  const activeTab = settings.showTranslation ? "Translation" : "Reading";
  const activeIdx = tabs.indexOf(activeTab);

  const arabicDisplay = Math.round(settings.arabicSize * 13.6).toString();
  const translationDisplay = Math.round(settings.translationSize * 16.7).toString();

  const ReadingIconClosed = (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M20.17 15.34V4.28C20.17 3.18 19.27 2.36 18.18 2.46H18.12C16.2 2.62 13.27 3.6 11.64 4.63L11.49 4.73C11.22 4.89 10.78 4.89 10.51 4.73L10.29 4.59C8.65 3.57 5.74 2.6 3.81 2.45C2.72 2.36 1.83 3.18 1.83 4.27V15.34C1.83 16.22 2.55 17.05 3.43 17.16L3.69 17.2C5.68 17.46 8.75 18.47 10.51 19.43L10.55 19.45C10.8 19.59 11.19 19.59 11.43 19.45C13.19 18.48 16.27 17.46 18.27 17.2L18.57 17.16C19.45 17.05 20.17 16.22 20.17 15.34Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11 5.03V18.78" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.1 7.78H5.04" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.79 10.53H5.04" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const ReadingIconOpen = (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <path d="M23.83 5.06V18.14C23.83 19.18 22.99 20.15 21.95 20.28L21.59 20.32C19.23 20.64 15.59 21.84 13.51 22.99C13.37 23.08 13.2 23.11 13 23.11V5.74C13.21 5.74 13.41 5.69 13.57 5.59L13.76 5.47C15.69 4.26 19.14 3.1 21.42 2.9H21.48C22.77 2.79 23.83 3.76 23.83 5.06Z" fill="currentColor"/>
      <path opacity="0.4" d="M13 5.74V23.11C12.82 23.11 12.62 23.08 12.47 22.99L12.43 22.97C10.35 21.83 6.72 20.64 4.37 20.32L4.05 20.28C3.01 20.15 2.17 19.18 2.17 18.14V5.05C2.17 3.76 3.22 2.78 4.51 2.89C6.78 3.08 10.23 4.23 12.15 5.43L12.43 5.59C12.59 5.69 12.79 5.74 13 5.74Z" fill="currentColor"/>
    </svg>
  );

  const FontIconClosed = (
    <svg width="19" height="18" viewBox="0 0 19 18" fill="none">
      <path d="M7.07 16.5H11.57C15.32 16.5 16.82 15 16.82 11.25V6.75C16.82 3 15.32 1.5 11.57 1.5H7.07C3.32 1.5 1.82 3 1.82 6.75V11.25C1.82 15 3.32 16.5 7.07 16.5Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.57 6.67C7.93 5.49 10.71 5.49 13.07 6.67" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.32 12.23V5.95" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const FontIconOpen = (
    <svg width="19" height="18" viewBox="0 0 19 18" fill="none">
      <path d="M7.07 16.5H11.57C15.32 16.5 16.82 15 16.82 11.25V6.75C16.82 3 15.32 1.5 11.57 1.5H7.07C3.32 1.5 1.82 3 1.82 6.75V11.25C1.82 15 3.32 16.5 7.07 16.5Z" fill="currentColor"/>
      <path d="M5.57 6.67C7.93 5.49 10.71 5.49 13.07 6.67" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.32 12.23V5.95" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div
      className="fixed right-0 top-0 z-30 h-full flex flex-col overflow-hidden"
      style={{
        width: "var(--right-sidebar-size)",
        backgroundColor: "var(--secondary-bg)",
        borderLeft: "1px solid var(--border-color)",
        paddingTop: "var(--top-nav-size)",
      }}
    >
      <div className="relative flex w-full flex-col overflow-y-auto h-full">
        <div className="flex w-full flex-col pt-6 overflow-hidden">

          {/* Translation / Reading tab toggle */}
          <div className="px-[26px] mb-4">
            <div
              className="relative isolate flex min-h-10 items-center rounded-full border-4"
              style={{ borderColor: "var(--secondary-bg)", backgroundColor: "var(--secondary-bg)" }}
            >
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => onUpdate({ showTranslation: t === "Translation" })}
                  className="z-10 h-full w-full py-2 text-[15px] transition-colors"
                  style={{
                    color: activeTab === t ? "var(--pure-color)" : "var(--subtitle-color-secondary)",
                    fontWeight: activeTab === t ? 600 : 400,
                  }}
                >
                  {t}
                </button>
              ))}
              {/* Sliding pill */}
              <div
                className="absolute h-full rounded-full transition-transform duration-300 ease-in-out"
                style={{
                  width: "50%",
                  transform: `translateX(${activeIdx * 100}%)`,
                  backgroundColor: "var(--primary-bg)",
                }}
              />
            </div>
          </div>

          {/* Accordion sections */}
          <div className="space-y-1">
            <AccordionSection
              isOpen={readingOpen}
              onToggle={() => setReadingOpen((v) => !v)}
              iconClosed={ReadingIconClosed}
              iconOpen={ReadingIconOpen}
              label="Reading Settings"
            >
              <p className="text-[13px]" style={{ color: "var(--subtitle-color)" }}>
                Reading settings coming soon.
              </p>
            </AccordionSection>

            <AccordionSection
              isOpen={fontOpen}
              onToggle={() => setFontOpen((v) => !v)}
              iconClosed={FontIconClosed}
              iconOpen={FontIconOpen}
              label="Font Settings"
            >
              <RangeSlider
                label="Arabic Font Size"
                value={settings.arabicSize}
                min={ARABIC_SIZE_MIN}
                max={ARABIC_SIZE_MAX}
                step={0.1}
                display={arabicDisplay}
                onChange={(v) => onUpdate({ arabicSize: v })}
              />
              <RangeSlider
                label="Translation Font Size"
                value={settings.translationSize}
                min={TRANSLATION_SIZE_MIN}
                max={TRANSLATION_SIZE_MAX}
                step={0.02}
                display={translationDisplay}
                onChange={(v) => onUpdate({ translationSize: v })}
              />
              {/* Arabic Font Face */}
              <div className="space-y-2">
                <p className="text-[15px] font-medium" style={{ color: "var(--pure-color)" }}>
                  Arabic Font Face
                </p>
                <button
                  className="flex min-h-[40px] w-full items-center justify-between rounded-sm px-4 py-2.5 text-[15px] capitalize"
                  style={{ backgroundColor: "var(--secondary-bg)", color: "var(--pure-color)" }}
                >
                  {ARABIC_FONTS.find((f) => f.id === settings.arabicFont)?.label ?? "KFGQ"}
                  <svg width="14" height="11" viewBox="0 0 15 14" fill="none" style={{ transform: "rotate(-90deg)", color: "var(--icon-color)" }}>
                    <path d="M11.82 5.22L8.01 9.02C7.57 9.47 6.83 9.47 6.38 9.02L2.58 5.22"
                      stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </AccordionSection>
          </div>

          {/* Support card */}
        <div className="mt-4 px-[26px]">
            <div
                className="relative isolate overflow-hidden rounded-md border px-3 pb-3 pt-3.5 space-y-2"
                style={{
                borderColor: "var(--primary-7)",
                backgroundColor: "var(--primary-10)",
                }}
            >
                <p className="text-[16px] font-bold" style={{ color: "var(--pure-color)" }}>
                Help spread the knowledge of Islam
                </p>

                <p className="text-[13px]" style={{ color: "var(--subtitle-color-secondary)" }}>
                Your regular support helps us reach our religious brothers and sisters with the
                message of Islam. Join our mission and be part of the big change.
                </p>

                <a
                href="https://irdfoundation.com/sadaqa-jaria"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex h-10 w-full items-center justify-center rounded-sm text-[14px] font-semibold"
                style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-fg)",
                }}
                >
                Support Us
                </a>
            </div>
        </div>

        </div>
      </div>
    </div>
  );
}