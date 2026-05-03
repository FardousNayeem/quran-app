"use client";

import { IconStrip } from "@/components/layout/iconstrip";
import { SurahSidebar } from "@/components/layout/surahbar";
import { RightPanel } from "@/components/layout/rightpanel";
import { TopNav } from "@/components/layout/topnav";
import { useFontSettings } from "@/hooks/useFontSettings";
import type { SurahMeta } from "@/types/quran.types";

interface Props {
  surahs: SurahMeta[];
  activeSurahNo: number;
  children: React.ReactNode;
}

export function AppShell({ surahs, activeSurahNo, children }: Props) {
  const { settings, update } = useFontSettings();

  return (
    <div style={{ backgroundColor: "var(--primary-bg)", minHeight: "100vh" }}>
      {/* Fixed: icon strip (far left) */}
      <IconStrip />

      {/* Fixed: top nav bar */}
      <TopNav />

      {/* Fixed: left sidebar (surah list) */}
      <SurahSidebar surahs={surahs} activeSurahNo={activeSurahNo} />

      {/* Fixed: right panel (settings) */}
      <RightPanel settings={settings} onUpdate={update} />

      {/* Scrollable center content */}
      <main
        style={{
          marginLeft: "calc(var(--side-nav-size) + var(--left-sidebar-size))",
          marginRight: "var(--right-sidebar-size)",
          paddingTop: "var(--top-nav-size)",
          minHeight: "100vh",
          backgroundColor: "var(--primary-bg)",
        }}
      >
        {children}
      </main>
    </div>
  );
}