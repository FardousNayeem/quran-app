import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchAllSurahs, fetchSurah } from "@/lib/api.client";
import { displaySurahName, toArabicNumeral } from "@/lib/quran.helpers";
import type { Ayah, SurahResponse } from "@/types/quran.types";

export const dynamicParams = false;
export const revalidate = 60 * 60 * 12;

export async function generateStaticParams() {
  try {
    const surahs = await fetchAllSurahs();

    return surahs.map((surah) => ({
      id: String(surah.surahNo),
    }));
  } catch {
    return Array.from({ length: 114 }, (_, index) => ({
      id: String(index + 1),
    }));
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SurahPage({ params }: PageProps) {
  const { id } = await params;
  const surahNo = Number(id);

  if (!Number.isInteger(surahNo) || surahNo < 1 || surahNo > 114) {
    notFound();
  }

  const surah = await fetchSurah(surahNo).catch(() => null);

  if (!surah) {
    notFound();
  }

  return <SurahReader surah={surah} />;
}

function SurahReader({ surah }: { surah: SurahResponse }) {
  const title = displaySurahName(surah.meta.surahName);
  const revelationPlace = displayRevelationPlace(surah.meta.revelationPlace);
  const iconSrc = getRevelationIconSrc(surah.meta.revelationPlace);
  const showBismillah = HeaderBismillah(surah.meta.surahNo);

  return (
    <section
      className="min-h-[calc(100vh-var(--top-nav-size))] bg-[var(--primary-bg)]"
      style={
        {
          "--reader-padding-x": "36px",
        } as CSSProperties
      }
    >
      <header className="grid grid-cols-1 items-center px-[var(--reader-padding-x)] py-5 md:grid-cols-3">
        <div className="hidden md:block">
          <div className="relative h-[92px] w-[150px]">
            <Image
              src={iconSrc}
              alt={revelationPlace}
              fill
              priority
              sizes="150px"
              className="object-contain"
            />
          </div>
        </div>

        <div className="space-y-2 text-center">
          <h1 className="text-[24px] font-semibold leading-tight text-[var(--pure-color)]">
            Surah {title}
          </h1>

          <p className="text-base capitalize text-[var(--subtitle-color)]">
            Ayah-{surah.meta.totalAyah}, {revelationPlace}
          </p>
        </div>

        <div className="hidden justify-end md:flex">
          {showBismillah && (
            <div className="relative h-[54px] w-[210px]">
              <Image
                src="/icons/bismillah.png"
                alt="Bismillah"
                fill
                priority
                sizes="210px"
                className="object-contain"
              />
            </div>
          )}
        </div>
      </header>

      <div>
        {surah.ayahs.map((ayah) => (
          <AyahCard
            key={`${surah.meta.surahNo}:${ayah.ayahNo}`}
            surahNo={surah.meta.surahNo}
            ayah={ayah}
          />
        ))}
      </div>
    </section>
  );
}

function AyahCard({ surahNo, ayah }: { surahNo: number; ayah: Ayah }) {
  const ayahReference = `${surahNo}:${ayah.ayahNo}`;

  return (
    <article
      id={`ayah-${ayahReference}`}
      className="relative overflow-hidden border-b border-[var(--border-color)] px-[var(--reader-padding-x)] py-6 transition-colors duration-200"
    >
      <div className="flex items-center justify-between">
        <p className="pl-2 text-base font-semibold text-[var(--primary)]">
          {ayahReference}
        </p>

        <div className="md:hidden">
          <button
            type="button"
            aria-label="More ayah actions"
            className="flex size-[34px] min-w-[34px] items-center justify-center rounded-full text-[var(--icon-color)] hover:bg-[var(--primary-7)]"
          >
            <MoreIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-7 pt-3 md:grid-cols-[34px_1fr]">
        <div className="hidden flex-col items-center gap-2 md:flex">
          <AyahActionButton label="Play ayah">
            <PlayIcon className="h-[18px] w-[18px]" />
          </AyahActionButton>

          <AyahActionButton label="Open reading tools">
            <BookIcon className="h-[22px] w-[22px]" />
          </AyahActionButton>

          <AyahActionButton label="Bookmark ayah">
            <BookmarkIcon className="h-5 w-5" />
          </AyahActionButton>

          <AyahActionButton label="More ayah actions">
            <MoreIcon className="h-5 w-5" />
          </AyahActionButton>
        </div>

        <div>
          <p
            dir="rtl"
            className="mb-4 text-right text-[var(--pure-color)]"
            style={{
              fontFamily:
                "var(--font-arabic), var(--font-kfgq), Amiri, Scheherazade New, serif",
              fontSize: "var(--arabic-font-size)",
              lineHeight: "var(--arabic-line-height)",
            }}
          >
            {ayah.arabic1}
            <span
                className="mx-2 inline align-middle leading-none text-[1.0em] text-[var(--pure-color)]"
                style={{
                    fontFamily: "var(--font-kfgq), serif",
                }}
                >
                {toArabicNumeral(ayah.ayahNo)}
            </span>
          </p>

          <div className="space-y-2">
            <p className="text-[13px] uppercase tracking-[0.02em] text-[var(--subtitle-color)]">
              Saheeh International
            </p>

            <p
              className="text-[var(--pure-color)]"
              style={{
                fontFamily: "var(--font-translation)",
                fontSize: "var(--translation-font-size)",
                lineHeight: 1.6,
              }}
            >
              {ayah.english}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

function AyahActionButton({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="group flex size-[34px] min-w-[34px] cursor-pointer items-center justify-center rounded-full bg-transparent text-[var(--icon-color)] transition-colors active:scale-90 hover:bg-[var(--primary-7)] hover:text-[var(--pure-color)]"
    >
      {children}
    </button>
  );
}

function normalizeRevelationPlace(place: string): string {
  return place.trim().toLowerCase();
}

function isMakkahPlace(place: string): boolean {
  const normalized = normalizeRevelationPlace(place);

  return (
    normalized.includes("mecca") ||
    normalized.includes("makkah") ||
    normalized.includes("makka") ||
    normalized.includes("makki") ||
    normalized === "meccan"
  );
}

function isMadinahPlace(place: string): boolean {
  const normalized = normalizeRevelationPlace(place);

  return (
    normalized.includes("medina") ||
    normalized.includes("madina") ||
    normalized.includes("madinah") ||
    normalized.includes("madani") ||
    normalized === "medinan"
  );
}

function displayRevelationPlace(place: string): string {
  if (isMadinahPlace(place)) {
    return "Madinah";
  }

  if (isMakkahPlace(place)) {
    return "Makkah";
  }

  return place;
}

function getRevelationIconSrc(place: string): string {
  if (isMadinahPlace(place)) {
    return "/icons/madinah.png";
  }

  return "/icons/makkah.png";
}

function HeaderBismillah(surahNo: number): boolean {
  return surahNo !== 1 && surahNo !== 9;
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 9.00004V6.33004C3 3.01504 5.3475 1.65754 8.22 3.31504L10.5375 4.65004L12.855 5.98504C15.7275 7.64254 15.7275 10.3575 12.855 12.015L10.5375 13.35L8.22 14.685C5.3475 16.3425 3 14.985 3 11.67V9.00004Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20.1673 15.3449V4.28072C20.1673 3.18072 19.269 2.36489 18.1782 2.45655H18.1232C16.1982 2.62155 13.274 3.60239 11.6423 4.62906L11.4865 4.72989C11.2207 4.89489 10.7807 4.89489 10.5148 4.72989L10.2857 4.59239C8.65398 3.57489 5.73898 2.60322 3.81398 2.44739C2.72315 2.35572 1.83398 3.18072 1.83398 4.27155V15.3449C1.83398 16.2249 2.54898 17.0499 3.42898 17.1599L3.69482 17.1966C5.68398 17.4624 8.75482 18.4707 10.5148 19.4332L10.5515 19.4516C10.799 19.5891 11.1932 19.5891 11.4315 19.4516C13.1915 18.4799 16.2715 17.4624 18.2698 17.1966L18.5723 17.1599C19.4523 17.0499 20.1673 16.2249 20.1673 15.3449Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 5.03247V18.7825"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.10352 7.78247H5.04102"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.79102 10.5325H5.04102"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="18"
      viewBox="0 0 16 18"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M1.64453 13.7513V7.17862C1.64453 4.29211 1.64453 2.84886 2.57528 1.95214C3.50603 1.05542 5.00405 1.05542 8.00009 1.05542C10.9961 1.05542 12.4942 1.05542 13.4249 1.95214C14.3556 2.84886 14.3556 4.29211 14.3556 7.17862V13.7513C14.3556 15.5832 14.3556 16.4991 13.7417 16.827C12.5527 17.4618 10.3224 15.3437 9.26325 14.7059C8.64899 14.336 8.34186 14.151 8.00009 14.151C7.65832 14.151 7.35118 14.336 6.73692 14.7059C5.67777 15.3437 3.4475 17.4618 2.25852 16.827C1.64453 16.4991 1.64453 15.5832 1.64453 13.7513Z"
        stroke="currentColor"
        strokeWidth="1.38569"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.64453 5.02588H14.3556"
        stroke="currentColor"
        strokeWidth="1.38569"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MoreIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M5 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0m5 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0m5 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}