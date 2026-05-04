import type { Metadata } from "next";
import type React from "react";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script"; // ◀ Google Analytics를 위한 Script 컴포넌트 추가
import "./globals.css";

export const metadata: Metadata = {
  title: "사단법인 한국신용카드네트워크",
  description:
    "대한민국 소상공인과 가맹점주의 권익을 대변하는 법정 단체, 한국신용카드네트워크입니다.",
  keywords: [
    "한국신용카드네트워크",
    "KCCN",
    "소상공인",
    "신용카드",
    "가맹점",
    "카드결제",
    "PG",
    "기후에너지",
    "스테이블코인",
    "제로페이",
    "QR코드결제",
    "가상화폐",
    "VAN",
    "간편결제",
    "한신네",
  ],
  verification: {
    google: "rEUZ578wO8HxLWwiRlVFClLe1zY6brB2nrJA76-H1ec",
  },
  other: {
    "naver-site-verification": "c0eed67929da91db0c80d533c7bd02df9d88890b",
  },
  openGraph: {
    title: "사단법인 한국신용카드네트워크",
    description: "대한민국 소상공인과 가맹점주의 권익을 대변하는 중소벤쳐기업부 제2010-3호 인가 전문 경제 법정단체입니다.",
    url: "https://www.kccn.or.kr",
    siteName: "사단법인 한국신용카드네트워크",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* ▽ Google Analytics (GA4) 설정 시작 ▽ */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TSTEMGGQRC"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-TSTEMGGQRC');
          `}
        </Script>
        {/* △ Google Analytics (GA4) 설정 끝 △ */}
      </head>
      <body className="antialiased font-sans tracking-tight">
        {children}
        <Analytics />
      </body>
    </html>
  );
}