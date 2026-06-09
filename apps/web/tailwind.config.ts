import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#090d14",
        panel: "#0f1623",
        border: "#253044",
        muted: "#93a4b8",
        foreground: "#edf3fb",
        accent: "#38d5b5",
        warning: "#f6c756",
        danger: "#ff6b6b",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
};

export default config;
