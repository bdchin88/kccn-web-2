import type { Config } from "tailwindcss";

const config: Config = {
  // Tailwind가 디자인을 적용할 대상 폴더들을 지정합니다.
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 기존에 쓰던 특별한 색상이나 디자인이 있다면 여기에 추가되지만,
      // 일단 기본 디자인 복구를 위해 비워둡니다.
    },
  },
  plugins: [],
};
export default config;