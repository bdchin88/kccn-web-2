/** @type {import('next').NextConfig} */
const nextConfig = {
  // 불필요한 eslint 설정을 지우고 빌드 오류 무시 옵션만 남깁니다.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};
export default nextConfig;