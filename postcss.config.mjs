/* * @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {}, // 👈 여기를 다시 'tailwindcss'로 원상복구 합니다.
    autoprefixer: {},
  },
};

export default config; 