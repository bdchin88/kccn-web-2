/** @type {import('next').NextConfig} */
const nextConfig = {
  // eslint 키를 제거하고 아래 설정만 남깁니다.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;