/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 16에서는 eslint 설정을 config 파일에서 직접 다루는 방식이 변경되었습니다.
  // 빌드 시 에러를 무시하려면 아래 옵션만 남기세요.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;