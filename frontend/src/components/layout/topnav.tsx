"use client";

import Link from "next/link";
import { useState } from "react";
import { SearchModal } from "@/components/search/searchmodal";

export function TopNav() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 right-0 z-[2] flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--primary-bg)] px-6"
        style={{
          left: "var(--side-nav-size)",
          height: "var(--top-nav-size)",
        }}
      >
        <Link href="/" className="flex select-none flex-col">
          <p className="mt-[2px] font-latin text-xl font-bold leading-none text-[var(--pure-color)]">
            Quran Mazid
          </p>
          <p className="mt-[2px] w-max text-[10px] tracking-tight text-[var(--subtitle-color)] [word-spacing:2px]">
            Read, Study, and Learn The Quran
          </p>
        </Link>

        <div className="flex items-center gap-4 md:gap-6">
          <button
            type="button"
            aria-label="Search Quran"
            aria-haspopup="dialog"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen(true)}
            className="group flex size-[34px] min-w-[34px] cursor-pointer items-center justify-center rounded-full bg-[var(--primary-7)] text-[var(--primary)] transition-transform active:scale-90 [&>svg]:size-[18px]"
          >
            <SearchIcon />
          </button>

          <button
            type="button"
            aria-label="Dark theme"
            className="group flex size-[34px] min-w-[34px] cursor-pointer items-center justify-center rounded-full bg-[var(--primary-7)] text-[var(--primary)] outline-none transition-transform active:scale-90 [&>svg]:size-[18px]"
          >
            <ThemeIcon />
          </button>

          <Link
            href="https://irdfoundation.com/sadaqa-jaria"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-[38px] min-w-[136px] select-none items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-2 text-[var(--primary-fg)] md:flex"
          >
            <span className="text-base font-medium text-[var(--primary-fg)]">
              Support Us
            </span>

            <HeartIcon />
          </Link>
        </div>
      </nav>

      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M18.3789 18.3721L14.7539 14.7471M16.7122 10.0387C16.7122 13.7206 13.7275 16.7054 10.0456 16.7054C6.36367 16.7054 3.37891 13.7206 3.37891 10.0387C3.37891 6.35684 6.36367 3.37207 10.0456 3.37207C13.7275 3.37207 16.7122 6.35684 16.7122 10.0387Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ThemeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="m14.712 7.596l-2.289-2.288l2.289-2.289L17 5.308zm5 3l-1.289-1.288l1.289-1.289L21 9.308zM12.075 21q-1.888 0-3.543-.713T5.64 18.336t-1.951-2.893t-.714-3.543q0-2.92 1.68-5.265t4.436-3.27q-.104 2.34.717 4.501q.82 2.161 2.48 3.82q1.66 1.66 3.82 2.481t4.502.717q-.92 2.754-3.268 4.435T12.075 21"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="18"
      viewBox="0 0 19 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        opacity="0.4"
        d="M15.2153 6.0675C15.2153 6.18 15.2153 6.29251 15.2078 6.39751C14.0603 5.97001 12.7103 6.23251 11.8103 7.04251C11.2028 6.49501 10.4153 6.18751 9.57531 6.18751C7.73031 6.18751 6.23032 7.69501 6.23032 9.55501C6.23032 11.6775 7.29532 13.23 8.31532 14.235C8.23282 14.2275 8.16532 14.2125 8.10532 14.19C6.16282 13.5225 1.82031 10.7625 1.82031 6.0675C1.82031 3.9975 3.48531 2.32501 5.54031 2.32501C6.76281 2.32501 7.84281 2.91 8.51781 3.8175C9.20031 2.91 10.2803 2.32501 11.4953 2.32501C13.5503 2.32501 15.2153 3.9975 15.2153 6.0675Z"
        fill="currentColor"
      />
      <path
        d="M13.8217 7.1925C13.0192 7.1925 12.2917 7.58251 11.8417 8.18251C11.3917 7.58251 10.6717 7.1925 9.86171 7.1925C8.49671 7.1925 7.38672 8.30251 7.38672 9.68251C7.38672 10.215 7.46922 10.7025 7.61922 11.1525C8.32422 13.38 10.4917 14.7075 11.5642 15.075C11.7142 15.1275 11.9617 15.1275 12.1192 15.075C13.1917 14.7075 15.3592 13.38 16.0642 11.1525C16.2142 10.695 16.2967 10.2075 16.2967 9.68251C16.2967 8.30251 15.1867 7.1925 13.8217 7.1925Z"
        fill="currentColor"
      />
    </svg>
  );
}