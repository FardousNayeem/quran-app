import { fetchAllSurahs } from "@/lib/api.client";
import { AppShell } from "@/components/layout/AppShell";
import type { SurahMeta } from "@/types/quran.types";

export default async function SurahLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const surahs = await fetchAllSurahs().catch(() => [] as SurahMeta[]);

  return <AppShell surahs={surahs}>{children}</AppShell>;
}