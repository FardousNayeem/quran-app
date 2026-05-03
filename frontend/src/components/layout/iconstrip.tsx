"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function NavBtn({
  label,
  active,
  onClick,
  href,
  children,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  href?: string;
  children: React.ReactNode;
}) {
  const cls = `flex size-9 items-center justify-center rounded-sm border-2 transition-all duration-300`;
  const style = {
    borderColor: active ? "var(--primary)" : "transparent",
    color: active ? "var(--primary)" : "var(--icon-color)",
  };

  if (href) {
    return (
      <Link href={href} aria-label={label} title={label}>
        <span className={cls} style={style}>{children}</span>
      </Link>
    );
  }
  return (
    <button aria-label={label} title={label} onClick={onClick} className={cls} style={style}>
      {children}
    </button>
  );
}

export function IconStrip() {
  const pathname = usePathname();
  const isReader = pathname.startsWith("/surah");

  return (
    <nav
      className="fixed left-0 top-0 h-full z-40 flex flex-col items-center"
      style={{
        width: "var(--side-nav-size)",
        backgroundColor: "var(--secondary-bg)",
        borderRight: "1px solid var(--border-color)",
      }}
    >
      {/* Logo */}
      <Link href="/" className="py-3 flex items-center justify-center w-full">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M6.99 0H29.01C32.87 0 36 3.13 36 6.99V29.01C36 32.87 32.87 36 29.01 36H6.99C3.13 36 0 32.87 0 29.01V6.99C0 3.13 3.13 0 6.99 0Z" fill="var(--primary)"/>
          <path d="M26.07 24.57V28.24C26.07 28.36 26.04 28.47 25.98 28.57C25.92 28.67 25.84 28.76 25.74 28.82C25.64 28.88 25.53 28.92 25.41 28.92C25.3 28.93 25.18 28.9 25.07 28.85L18 25.26" stroke="#E2E2E2" strokeWidth="0.78"/>
          <path d="M9.93 24.57V28.24C9.93 28.36 9.96 28.47 10.02 28.57C10.07 28.67 10.16 28.76 10.26 28.82C10.36 28.88 10.47 28.92 10.59 28.92C10.7 28.93 10.82 28.9 10.92 28.85L18 25.26" stroke="#E2E2E2" strokeWidth="0.78"/>
          <path opacity="0.35" d="M17.58 24.14C17.58 24.37 17.77 24.56 18 24.56V25.54L8.6 23.61L7.45 23.38C7.09 23.31 6.77 23.12 6.54 22.84C6.31 22.55 6.18 22.2 6.18 21.83V10.87C6.18 9.9 7.05 9.16 8.01 9.31L18 10.9V11.88C17.89 11.88 17.79 11.93 17.71 12.01C17.63 12.08 17.58 12.19 17.58 12.3V24.14Z" fill="#E2E2E2"/>
          <path opacity="0.35" d="M18.42 24.14C18.42 24.37 18.23 24.56 18 24.56V25.54L27.4 23.61L28.55 23.38C28.91 23.31 29.23 23.12 29.46 22.84C29.7 22.55 29.82 22.2 29.82 21.83V10.87C29.82 9.9 28.95 9.16 27.99 9.31L18 10.9V11.88C18.23 11.88 18.42 12.07 18.42 12.3V24.14Z" fill="#E2E2E2"/>
          <path d="M17.58 24.14C17.58 24.37 17.77 24.56 18 24.56V25.54L9.93 22.04L8.6 21.46C8.3 21.33 8.04 21.11 7.86 20.84C7.68 20.56 7.58 20.24 7.58 19.91V9.37C7.58 9.1 7.65 8.83 7.78 8.59C7.9 8.34 8.09 8.13 8.31 7.98C8.54 7.82 8.8 7.73 9.07 7.69C9.35 7.66 9.62 7.7 9.88 7.79L18 10.9V11.88C17.89 11.88 17.78 11.93 17.7 12.01C17.63 12.08 17.58 12.19 17.58 12.3V24.14Z" fill="white"/>
          <path d="M28.03 9.37V19.91C28.03 20.43 27.72 20.9 27.24 21.1L25.91 21.68L18.39 24.94V24.85C18.46 24.81 18.52 24.77 18.57 24.71C18.65 24.64 18.7 24.55 18.75 24.45C18.79 24.36 18.81 24.25 18.81 24.14V12.3C18.81 12.08 18.72 11.88 18.57 11.73C18.52 11.68 18.46 11.63 18.39 11.59V11.17L26.26 8.16C26.46 8.08 26.67 8.06 26.88 8.08C27.09 8.11 27.29 8.18 27.46 8.3C27.64 8.42 27.78 8.58 27.88 8.77C27.97 8.95 28.03 9.16 28.03 9.37Z" fill="#E2E2E2" stroke="#E2E2E2" strokeWidth="0.78"/>
        </svg>
      </Link>

      {/* Nav icons — centered vertically */}
      <div className="flex flex-col items-center justify-center gap-6 flex-1 pb-4">
        {/* Home */}
        <NavBtn label="Home" href="/">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M9.23 2.58L2.88 7.67C2.16 8.24 1.7 9.44 1.86 10.34L3.08 17.64C3.3 18.94 4.55 20 5.87 20H16.13C17.44 20 18.7 18.93 18.92 17.64L20.14 10.34C20.29 9.44 19.83 8.24 19.12 7.67L12.77 2.59C11.79 1.81 10.2 1.81 9.23 2.58Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11 14.21C12.27 14.21 13.29 13.18 13.29 11.92C13.29 10.65 12.27 9.63 11 9.63C9.74 9.63 8.71 10.65 8.71 11.92C8.71 13.18 9.74 14.21 11 14.21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </NavBtn>

        {/* Read Quran — active when on surah page */}
        <NavBtn label="Read Quran" href="/surah/1" active={isReader}>
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path opacity="0.4" d="M20.23 2.17H18.17C15.81 2.17 14.56 3.41 14.56 5.77V7.83C14.56 10.19 15.81 11.44 18.17 11.44H20.23C22.59 11.44 23.83 10.19 23.83 7.83V5.77C23.83 3.41 22.59 2.17 20.23 2.17Z" fill="currentColor"/>
            <path opacity="0.4" d="M7.84 14.55H5.78C3.41 14.55 2.17 15.79 2.17 18.16V20.21C2.17 22.59 3.41 23.83 5.77 23.83H7.83C10.19 23.83 11.44 22.59 11.44 20.23V18.17C11.45 15.79 10.2 14.55 7.84 14.55Z" fill="currentColor"/>
            <path d="M6.81 11.46C9.38 11.46 11.46 9.38 11.46 6.81C11.46 4.25 9.38 2.17 6.81 2.17C4.25 2.17 2.17 4.25 2.17 6.81C2.17 9.38 4.25 11.46 6.81 11.46Z" fill="currentColor"/>
            <path d="M19.19 23.83C21.75 23.83 23.83 21.75 23.83 19.19C23.83 16.62 21.75 14.54 19.19 14.54C16.62 14.54 14.54 16.62 14.54 19.19C14.54 21.75 16.62 23.83 19.19 23.83Z" fill="currentColor"/>
          </svg>
        </NavBtn>

        {/* Go to Ayah */}
        <NavBtn label="Go to Ayah">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M6.78 5.79L14.57 3.2C18.06 2.03 19.96 3.94 18.8 7.43L16.21 15.22C14.46 20.45 11.6 20.45 9.86 15.22L9.09 12.91L6.78 12.14C1.55 10.39 1.55 7.54 6.78 5.79Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.27 12.51L12.55 9.22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </NavBtn>

        {/* Bookmarks */}
        <NavBtn label="Bookmarks" href="/bookmarks">
          <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
            <path d="M1.64 13.75V7.18C1.64 4.29 1.64 2.85 2.58 1.95C3.51 1.06 5.0 1.06 8 1.06C11 1.06 12.49 1.06 13.42 1.95C14.36 2.85 14.36 4.29 14.36 7.18V13.75C14.36 15.58 14.36 16.5 13.74 16.83C12.55 17.46 10.32 15.34 9.26 14.71C8.65 14.34 8.34 14.15 8 14.15C7.66 14.15 7.35 14.34 6.74 14.71C5.68 15.34 3.45 17.46 2.26 16.83C1.64 16.5 1.64 15.58 1.64 13.75Z" stroke="currentColor" strokeWidth="1.39" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1.64 5.03H14.36" stroke="currentColor" strokeWidth="1.39" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </NavBtn>

        {/* More */}
        <NavBtn label="More options">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M20.17 7.58V3.88C20.17 2.42 19.58 1.83 18.12 1.83H14.42C12.96 1.83 12.38 2.42 12.38 3.88V7.58C12.38 9.04 12.96 9.62 14.42 9.62H18.12C19.58 9.62 20.17 9.04 20.17 7.58Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.63 7.81V3.65C9.63 2.36 9.04 1.83 7.58 1.83H3.88C2.42 1.83 1.83 2.36 1.83 3.65V7.8C1.83 9.1 2.42 9.62 3.88 9.62H7.58C9.04 9.62 9.63 9.1 9.63 7.81Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.63 18.12V14.42C9.63 12.96 9.04 12.38 7.58 12.38H3.88C2.42 12.38 1.83 12.96 1.83 14.42V18.12C1.83 19.58 2.42 20.17 3.88 20.17H7.58C9.04 20.17 9.63 19.58 9.63 18.12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.75 14.21H19.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M13.75 17.88H19.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </NavBtn>
      </div>
    </nav>
  );
}