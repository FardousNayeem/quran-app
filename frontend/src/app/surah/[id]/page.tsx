import { fetchAllSurahs } from "@/lib/api.client";
import { AppShell } from "@/components/layout/appshell";

export async function generateStaticParams() {
  try {
    const surahs = await fetchAllSurahs();
    return surahs.map((s) => ({ id: String(s.surahNo) }));
  } catch {
    return Array.from({ length: 114 }, (_, i) => ({ id: String(i + 1) }));
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SurahPage({ params }: PageProps) {
  const { id } = await params;
  const surahNo = Number(id);

  const surahs = await fetchAllSurahs().catch(() => []);

  return (
    <AppShell surahs={surahs} activeSurahNo={surahNo}>
      <div className="p-8" style={{ color: "var(--subtitle-color)" }}>
        Surah {surahNo} reader — coming next
      </div>
    </AppShell>
  );
}