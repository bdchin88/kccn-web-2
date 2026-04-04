/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // 빌드 시 타입스크립트 에러가 있어도 무시하고 진행
    ignoreBuildErrors: true,
  },
  eslint: {
    // 빌드 시 ESLint(문법 검사) 에러가 있어도 무시하고 진행
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;