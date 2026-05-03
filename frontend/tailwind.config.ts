import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Design system — all component colors reference these tokens
        surface: {
          DEFAULT: "var(--surface)",
          raised: "var(--surface-raised)",
          overlay: "var(--surface-overlay)",
        },
        border: {
          DEFAULT: "var(--border)",
          subtle: "var(--border-subtle)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          arabic: "var(--text-arabic)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          muted: "var(--accent-muted)",
        },
        icon: {
          DEFAULT: "var(--icon)",
          active: "var(--icon-active)",
        },
      },
      fontFamily: {
        arabic: ["var(--font-arabic)", "serif"],
        ui: ["var(--font-ui)", "sans-serif"],
      },
      fontSize: {
        "arabic-sm": "var(--arabic-size-sm)",
        "arabic-md": "var(--arabic-size-md)",
        "arabic-lg": "var(--arabic-size-lg)",
        "arabic-xl": "var(--arabic-size-xl)",
      },
      spacing: {
        "sidebar-icon": "72px",
        "sidebar-surah": "280px",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-in": "slideIn 0.25s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-12px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;