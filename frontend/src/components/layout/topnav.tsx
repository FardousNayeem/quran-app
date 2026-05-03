import Link from "next/link";

export function TopNav() {
  return (
    <nav
      className="fixed top-0 right-0 z-30 flex items-center justify-between px-6 border-b"
      style={{
        left: "var(--side-nav-size)",
        height: "var(--top-nav-size)",
        backgroundColor: "var(--primary-bg)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Left: brand */}
      <Link href="/" className="flex flex-col">
        <p
          className="font-bold text-lg leading-none"
          style={{ color: "var(--pure-color)" }}
        >
          Quran Mazid
        </p>
        <p
          className="text-[10px] tracking-tight mt-0.5"
          style={{ color: "var(--subtitle-color)" }}
        >
          Read, Study, and Learn The Quran
        </p>
      </Link>

      {/* Right: search + theme + support */}
      <div className="flex items-center gap-4">
        {/* Search button */}
        <button
          className="flex size-[34px] min-w-[34px] items-center justify-center rounded-full transition-colors active:scale-90"
          style={{
            backgroundColor: "var(--primary-7)",
            color: "var(--primary)",
          }}
          aria-label="Search"
        >
          <svg width="18" height="18" viewBox="0 0 21 21" fill="none">
            <path
              d="M18.38 18.37L14.75 14.75M16.71 10.04C16.71 13.72 13.73 16.71 10.05 16.71C6.36 16.71 3.38 13.72 3.38 10.04C3.38 6.36 6.36 3.37 10.05 3.37C13.73 3.37 16.71 6.36 16.71 10.04Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Theme toggle */}
        <button
          className="flex size-[34px] min-w-[34px] items-center justify-center rounded-full transition-colors active:scale-90"
          style={{
            backgroundColor: "var(--primary-7)",
            color: "var(--primary)",
          }}
          aria-label="Toggle theme"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="m14.71 7.6-2.29-2.29 2.29-2.29L17 5.31zm5 3-1.29-1.29 1.29-1.29L21 9.31zM12.07 21q-1.89 0-3.54-.71T5.64 18.34t-1.95-2.89t-.71-3.54q0-2.92 1.68-5.27t4.44-3.27q-.1 2.34.72 4.5q.82 2.16 2.48 3.82q1.66 1.66 3.82 2.48t4.5.72q-.92 2.75-3.27 4.44T12.07 21" />
          </svg>
        </button>

        {/* Support Us */}
        <Link
          href="https://irdfoundation.com/sadaqa-jaria"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-[38px] min-w-[136px] items-center justify-center gap-2 rounded-full px-4 text-base font-medium transition-colors"
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--primary-fg)",
          }}
        >
          <span>Support Us</span>

          <svg width="19" height="18" viewBox="0 0 19 18" fill="none">
            <path
              opacity="0.4"
              d="M15.22 6.07C15.22 6.18 15.22 6.29 15.21 6.4C14.06 5.97 12.71 6.23 11.81 7.04C11.2 6.5 10.42 6.19 9.58 6.19C7.73 6.19 6.23 7.7 6.23 9.56C6.23 11.68 7.3 13.23 8.32 14.24C8.23 14.23 8.17 14.21 8.11 14.19C6.16 13.52 1.82 10.76 1.82 6.07C1.82 4 3.49 2.33 5.54 2.33C6.76 2.33 7.84 2.91 8.52 3.82C9.2 2.91 10.28 2.33 11.5 2.33C13.55 2.33 15.22 4 15.22 6.07Z"
              fill="currentColor"
            />
            <path
              d="M13.82 7.19C13.02 7.19 12.29 7.58 11.84 8.18C11.39 7.58 10.67 7.19 9.86 7.19C8.5 7.19 7.39 8.3 7.39 9.68C7.39 10.22 7.47 10.7 7.62 11.15C8.32 13.38 10.49 14.71 11.56 15.08C11.71 15.13 11.96 15.13 12.12 15.08C13.19 14.71 15.36 13.38 16.06 11.15C16.21 10.7 16.3 10.21 16.3 9.68C16.3 8.3 15.19 7.19 13.82 7.19Z"
              fill="currentColor"
            />
          </svg>
        </Link>
      </div>
    </nav>
  );
}