"use client";

import { IconStrip } from "@/components/layout/iconstrip";
import { TopNav } from "@/components/layout/topnav";
import { RouteLoadingLine } from "@/components/layout/loadingline";
import { SurahSidebar } from "@/components/layout/surahbar";
import { RightPanel } from "@/components/layout/settingspanel";
import { useFontSettings } from "@/hooks/useFontSettings";
import type { SurahMeta } from "@/types/quran.types";

interface AppShellProps {
  surahs: SurahMeta[];
  children: React.ReactNode;
}

export function AppShell({ surahs, children }: AppShellProps) {
  const { settings, update } = useFontSettings();

  return (
    <div className="min-h-screen bg-[var(--primary-bg)] text-[var(--pure-color)]">
      <RouteLoadingLine />
      <IconStrip />
      <TopNav />

      <SurahSidebar surahs={surahs} />

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