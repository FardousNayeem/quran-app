import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/app/globals.css";
import { TopNav } from "@/components/layout/topnav";
import { IconStrip } from "@/components/layout/iconstrip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quran — Read, Study, and Learn",
  description: "A clean Quran reader with Arabic text, English translation, and audio recitation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geistSans.variable}>
        {/* Strip spans full height from top — renders over topbar zone */}
        <IconStrip />
        {/* Topbar starts after strip */}
        <TopNav />
        {/* Content: below topbar, right of strip */}
        <div
          style={{
            paddingTop: "58px",
            paddingLeft: "60px",
            minHeight: "100vh",
            backgroundColor: "var(--surface)",
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}