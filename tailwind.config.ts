import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // v0 원본 globals.css의 oklch 값을 반영한 코드입니다.
        primary: {
          DEFAULT: "oklch(0.35 0.15 240)", 
          foreground: "oklch(0.98 0 0)",
        },
        background: "oklch(0.98 0 0)",
        foreground: "oklch(0.15 0 0)",
      },
    },
  },
  plugins: [],
};
export default config;