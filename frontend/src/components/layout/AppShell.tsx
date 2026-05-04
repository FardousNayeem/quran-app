"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { IconStrip } from "@/components/layout/iconstrip";
import { TopNav } from "@/components/layout/topnav";
import { RouteLoadingLine } from "@/components/layout/loadingline";
import { SurahSidebar } from "@/components/layout/surahbar";
import { SettingsPanel } from "@/components/layout/settingspanel";
import { JumpToAyahModal } from "@/components/reader/jumptoayah";
import { useFontSettings } from "@/hooks/useFontSettings";
import type { SurahMeta } from "@/types/quran.types";

interface AppShellProps {
  surahs: SurahMeta[];
  children: React.ReactNode;
}

export function AppShell({ surahs, children }: AppShellProps) {
  const pathname = usePathname();
  const { settings, update } = useFontSettings();

  const [surahDrawerOpen, setSurahDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [jumpModalOpen, setJumpModalOpen] = useState(false);

  const activeSurahNo = useMemo(() => {
    const match = pathname.match(/^\/surah\/(\d+)/);
    const surahNo = match ? Number(match[1]) : 1;

    return Number.isInteger(surahNo) && surahNo >= 1 && surahNo <= 114
      ? surahNo
      : 1;
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[var(--primary-bg)] text-[var(--pure-color)]">
      <RouteLoadingLine />

      <IconStrip onGoToAyahClick={() => setJumpModalOpen(true)} />

      <TopNav
        onMenuClick={() => setSurahDrawerOpen(true)}
        onSettingsClick={() => setSettingsOpen(true)}
      />

      {/* Desktop + tablet-wide fixed sidebar */}
      <SurahSidebar surahs={surahs} variant="fixed" />

      {/* Tablet-narrow/mobile drawer sidebar */}
      <SurahSidebar
        surahs={surahs}
        variant="drawer"
        open={surahDrawerOpen}
        onClose={() => setSurahDrawerOpen(false)}
      />

      <SettingsPanel
        settings={settings}
        onUpdate={update}
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <main className="app-main min-h-screen bg-[var(--primary-bg)]">
        {children}
      </main>

      <JumpToAyahModal
        open={jumpModalOpen}
        onOpenChange={setJumpModalOpen}
        surahs={surahs}
        activeSurahNo={activeSurahNo}
      />
    </div>
  );
}