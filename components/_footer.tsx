// components/footer.tsx
"use client"

import { useRef } from "react"
//import VisitorCounter from "./supabase";
import VisitorCounter from "./VisitorCounter"; // 확장자(.tsx)는 생략해도 됩니다.
import Link from "next/link"

// 백그라운드 컬러: #03c87
export default function Footer() {
  type Partner = {
    name: string
    url: string
    type: "gov" | "non"
    logo?: string
  }

  const partners: Partner[] = [
    { name: "금융위원회", url: "https://www.fsc.go.kr", type: "gov" },
    { name: "중소벤처기업부", url: "https://www.mss.go.kr", type: "gov" },
    { name: "고용노동부", url: "https://www.moel.go.kr", type: "gov" },
    { name: "국세청", url: "https://www.nts.go.kr", type: "gov" },
    { name: "금융감독원", url: "https://www.fss.or.kr", type: "non", logo: "/images/non/fss-ci.png" },
    { name: "소상공인연합회", url: "https://www.kfme.or.kr", type: "non", logo: "/images/non/kfme-ci.png" },
    { name: "소상공인시장진흥공단", url: "https://www.semas.or.kr", type: "non", logo: "/images/non/semas-ci.png" },
    { name: "신용카드사회공헌재단", url: "https://www.ccscf.or.kr", type: "non", logo: "/images/non/ccscf-ci.png" }
  ]

  const govPartners = partners.filter(p => p.type === "gov")
  const nonGovPartners = partners.filter(p => p.type === "non")

  return (
    <div className="w-full">
      {/* 유관기관 배너 영역 */}
      <div className="bg-white border-t border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {/* 정부기관 텍스트 링크 */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
              <span className="font-semibold text-gray-700 min-w-[70px]">정부기관:</span>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                {govPartners.map((partner, index) => (
                  <div key={partner.name} className="flex items-center">
                    <a
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition-colors font-medium"
                    >
                      {partner.name}
                    </a>
                    {index < govPartners.length - 1 && (
                      <span className="text-gray-200 ml-4 select-none">|</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 유관단체 로고 링크 */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 pt-2 border-t border-gray-50">
              <span className="font-semibold text-gray-700 min-w-[70px] text-sm">유관단체:</span>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {nonGovPartners.map((partner) => (
                  <a
                    key={partner.name}
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-200 flex items-center justify-center h-7"
                    title={partner.name}
                  >
                    {partner.logo ? (
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="h-full object-contain max-w-[140px]"
                        onError={(e) => {
                          // 이미지 로드 실패시 텍스트로 대체 인터페이스 제공
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const span = document.createElement('span');
                            span.className = 'text-xs font-semibold text-gray-400 hover:text-blue-600';
                            span.innerText = partner.name;
                            parent.appendChild(span);
                          }
                        }}
                      />
                    ) : (
                      <span className="text-xs font-semibold text-gray-400 hover:text-blue-600">{partner.name}</span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 푸터 본문 영역 */}
      <footer className="bg-primary text-primary-foreground pt-3 pb-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-5 mb-3">
            <div>
              <Link href="/">
                <h3 className="font-bold text-xl mb-1 tracking-tighter whitespace-nowrap hover:text-blue-300 transition cursor-pointer">
                  사단법인&nbsp;한국신용카드네트워크
                </h3>
              </Link>
              <p className="text-sm opacity-90 whitespace-nowrap">
                소상공인과&nbsp;함께하는&nbsp;신뢰할&nbsp;수&nbsp;있는&nbsp;파트너
              </p>
              
              {/* 💡 [수정 내용] 주소 클릭 시 네이버 지도로 연결되도록 링크(a) 추가 및 마우스 호버 효과 부여 */}
              <p className="text-sm opacity-90 whitespace-nowrap">
                <span className="mr-1">주소:</span>
                <a 
                  href="https://map.naver.com/v5/search/%EC%84%9C%EC%9A%B8%EC%8B%9C%20%EB%A7%88%ED%8F%AC%EA%B5%A2%20%ED%86%A0%EC%A0%95%EB%A1%9C37%EA%B8%B841"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-dashed border-white/50 hover:border-blue-300 hover:text-blue-300 transition-all duration-200 cursor-pointer"
                  title="네이버 지도로 보기"
                >
                  서울시&nbsp;마포구&nbsp;토정로37길41,&nbsp;526호
                </a>
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-xl mb-1">연락처</h4>
              {/* 이전 요청하셨던 mb-0 조율 상태를 그대로 유지 */}
              <p className="text-sm opacity-90 whitespace-nowrap mb-0">
                전화:
                <a
                  href="tel:027063336"
                  className="ml-1 font-medium border-b border-transparent hover:border-blue-400 hover:text-blue-400 transition-all duration-200"
                >
                  02-706-3336
                </a>

                <span className="ml-4">
                  이메일:
                  <a
                    href="mailto:hans344712@gmail.com"
                    className="ml-1 font-medium border-b border-transparent hover:border-blue-400 hover:text-blue-400 transition-all duration-200"
                  >
                    hans344712@gmail.com
                  </a>
                </span>
              </p>
              <VisitorCounter />
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 pt-2.5 text-center text-sm opacity-90">
            <p>&copy; 2025 한국신용카드네트워크. All rights reserved.</p>
          </div>
          <div className="mt-1 mb-1 flex flex-col items-center gap-1.5">
            <span className="h-[6px] w-full rounded-full bg-gradient-to-r from-[#002B6B] to-[#004EA2]"></span>
            <span className="h-[6px] w-full rounded-full bg-gradient-to-r from-[#002B6B] to-[#004EA2]"></span>
          </div>
        </div>
      </footer>
    </div>
  )
}