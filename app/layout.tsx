import type { Metadata } from "next";
import type React from "react";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "사단법인 한국신용카드네트워크",
  description:
    "대한민국 소상공인과 가맹점주의 권익을 대변하는 경제단체, 한국신용카드네트워크입니다.",
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
  // 네이버 소유 확인을 위한 핵심 코드
  other: {
    "naver-site-verification": "c0eed67929da91db0c80d533c7bd02df9d88890b",
  },
  openGraph: {
    title: "사단법인 한국신용카드네트워크",
    description: "중소벤처기업부 인가 법정 단체 등록",
    url: "https://www.kccn.or.kr/",
    siteName: "한국신용카드네트워크",
    images: [
      {
        url: "/images/hero.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },  
  metadataBase: new URL("https://www.kccn.or.kr"),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
