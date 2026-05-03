import { fetchAllSurahs } from "@/lib/api.client";

export async function generateStaticParams() {
  try {
    const surahs = await fetchAllSurahs();
    return surahs.map((s) => ({ id: String(s.surahNo) }));
  } catch {
    // Fallback: pre-render all 114 statically if backend is unreachable at build time
    return Array.from({ length: 114 }, (_, i) => ({ id: String(i + 1) }));
  }
}

export default function SurahPage({ params }: { params: { id: string } }) {
  return (
    <main style={{ color: "white", padding: "2rem" }}>
      Surah {params.id} — coming in Step 3
    </main>
  );
}