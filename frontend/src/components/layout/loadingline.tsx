"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function RouteLoadingLine() {
  const pathname = usePathname();
  const firstRender = useRef(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    setVisible(true);

    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 650);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 z-[60] h-[3px] overflow-hidden"
      style={{
        left: "var(--side-nav-size)",
        width: "calc(100vw - var(--side-nav-size))",
        opacity: visible ? 1 : 0,
        transition: "opacity 180ms ease",
        pointerEvents: "none",
      }}
    >
      <div
        className={visible ? "route-loading-line-active" : ""}
        style={{
          height: "100%",
          backgroundColor: "var(--primary)",
          transformOrigin: "left center",
        }}
      />
    </div>
  );
}