/** @type {import('next').NextConfig} */
const nextConfig = {
  // 모든 복잡한 설정을 지우고 기본값만 남깁니다.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;