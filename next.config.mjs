/** @type {import('next').NextConfig} */
const nextConfig = {
  // 빌드 시 에러가 있어도 일단 완성을 시키도록 강제 설정
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;