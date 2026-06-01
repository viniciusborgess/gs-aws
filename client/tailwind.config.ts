import type { Config } from "tailwindcss";

// Paleta original do SpaceGuard, agora como tokens do Tailwind.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#0b1437", 600: "#131c4a" },
        gold: "#f5c84c",
        ink: "#1a1f36",
        bg: "#f4f6fb",
        border: "#e4e8f0",
        // cores por categoria de evento (borda lateral dos cards)
        fire: "#e8543f",
        storm: "#3b82f6",
        volcano: "#b45309",
        ice: "#06b6d4",
      },
      boxShadow: {
        card: "0 6px 24px rgba(11, 20, 55, 0.08)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
