/* * @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // 기존 'tailwindcss': {}를 이렇게 변경
    autoprefixer: {},
  },
};

export default config;