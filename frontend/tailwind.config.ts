import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary:    "var(--primary)",
        "primary-fg": "var(--primary-fg)",
        "primary-7":  "var(--primary-7)",
        "primary-10": "var(--primary-10)",
        "primary-bg": "var(--primary-bg)",
        "secondary-bg": "var(--secondary-bg)",
        "border-color": "var(--border-color)",
        "pure-color":   "var(--pure-color)",
        "subtitle-color": "var(--subtitle-color)",
        "subtitle-color-secondary": "var(--subtitle-color-secondary)",
        "icon-color": "var(--icon-color)",
      },
      fontSize: {
        "heading-5": "var(--text-heading-5)",
        "heading-6": "var(--text-heading-6)",
        "body":      "var(--text-body)",
        "title":     "var(--text-title)",
        "subtitle":  "var(--text-subtitle)",
      },
      width: {
        "side-nav":       "var(--side-nav-size)",
        "left-sidebar":   "var(--left-sidebar-size)",
        "right-sidebar":  "var(--right-sidebar-size)",
      },
      height: {
        "top-nav": "var(--top-nav-size)",
      },
    },
  },
  plugins: [],
};

export default config;