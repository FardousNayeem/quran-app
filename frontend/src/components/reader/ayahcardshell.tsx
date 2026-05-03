"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { useAudio } from "@/hooks/useAudio";

interface AyahCardShellProps {
  ayahReference: string;
  children: ReactNode;
}

export function AyahCardShell({
  ayahReference,
  children,
}: AyahCardShellProps) {
  const { activeKey, status } = useAudio();
  const articleRef = useRef<HTMLElement>(null);

  const isActive =
    activeKey === ayahReference &&
    (status === "playing" || status === "loading" || status === "paused");

  useEffect(() => {
    if (!isActive) return;

    articleRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [isActive]);

  return (
    <article
      ref={articleRef}
      id={`ayah-${ayahReference}`}
      data-active-ayah={isActive ? "true" : "false"}
      className="relative overflow-visible border-b border-[var(--border-color)] px-[var(--reader-padding-x)] py-6 transition-colors duration-300"
    >
      {children}
    </article>
  );
}