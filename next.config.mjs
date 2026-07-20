/* * @type {import('next').NextConfig} */
const nextConfig = {
  // 💡 Turbopack 빌드를 명시적으로 끄고 안정적인 Webpack을 사용하도록 설정합니다.
  experimental: {
    turbo: false,
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // 1. HSTS 설정 (1년간 HTTPS 강제)
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          // 2. 클릭재킹 방지 (iframe 삽입 차단)
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // 3. MIME 타입 스니핑 방지
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // 4. 리퍼러 정보 유출 제한
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // 5. 브라우저 기능 제한 (카메라, 마이크 등 차단)
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()", // ◀ 지오로케이션(위치) 기능 차단
          },
          // 6. XSS 필터링 활성화
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // 7. 격리된 세션 환경을 제공하여 리소스 및 팝업 창 간의 보안 격리를 강화
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          // 7.
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;