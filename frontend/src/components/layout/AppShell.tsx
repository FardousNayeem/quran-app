"use client";

import { IconStrip } from "@/components/layout/iconstrip";
import { SurahSidebar } from "@/components/layout/surahbar";
import { RightPanel } from "@/components/layout/rightpanel";
import { TopNav } from "@/components/layout/topnav";
import { useFontSettings } from "@/hooks/useFontSettings";
import type { SurahMeta } from "@/types/quran.types";

interface AppShellProps {
  surahs: SurahMeta[];
  activeSurahNo: number;
  children: React.ReactNode;
}

export function AppShell({
  surahs,
  activeSurahNo,
  children,
}: AppShellProps) {
  const { settings, update } = useFontSettings();

  return (
    <div className="min-h-screen bg-[var(--primary-bg)] text-[var(--pure-color)]">
      <IconStrip />
      <TopNav />

      <SurahSidebar surahs={surahs} activeSurahNo={activeSurahNo} />

      <RightPanel settings={settings} onUpdate={update} />

      <main
        className="min-h-screen bg-[var(--primary-bg)]"
        style={{
          marginLeft: "calc(var(--side-nav-size) + var(--left-sidebar-size))",
          marginRight: "var(--right-sidebar-size)",
          paddingTop: "var(--top-nav-size)",
        }}
      >
        {children}
      </main>
    </div>
  );
}