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
    { name: "중소벤처기업진흥공단", url: "https://www.kosmes.or.kr", type: "non", logo: "/images/non/kosmes-ci.png" },
    { name: "여신금융협회", url: "https://www.crefia.or.kr", type: "non", logo: "/images/non/crefia-ci.png" },
    { name: "노사발전재단", url: "https://www.nosa.or.kr", type: "non", logo: "/images/non/nosa-ci.png" },
    { name: "한국아이티평가원", url: "https://www.ksel.co.kr", type: "non", logo: "/images/non/ksel-ci.png" },
    { name: "직능경제인단체총연합회", url: "http://www.fps.or.kr", type: "non", logo: "/images/non/fps-ci.png" },
  ]

  const getPartnerLogo = (partner: Partner) => {
    if (partner.type === "gov") return "/images/gov-logo.png"
    if (partner.logo) return partner.logo
    return "/images/non-logo.jpg"
  }

  return (
    <>
      <div className="bg-primary text-primary-foreground border-b border-primary-foreground/20 py-2 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative flex overflow-hidden">
            <div className="animate-marquee flex gap-10 items-center">
              {[...partners, ...partners].map((partner, index) => (
                <a
                  key={index}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-0.5 py-2 text-sm font-medium hover:text-white/70 transition-colors whitespace-nowrap"
                >
                  {/* 🔹 로고 배경 래퍼 (주석을 여기로 이동) */}
                  <div className="flex items-center justify-center h-7 w-7 bg-primary">
                    <img
                      src={getPartnerLogo(partner)}
                      alt={partner.name}
                      className="max-h-7 max-w-7 object-contain"
                    />
                  </div>
                  <span>{partner.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* relative z-50 속성을 추가하여 hero.tsx의 z-20 팝업보다 명시적으로 높게 레이어를 배치합니다 */}
      <footer className="bg-primary text-primary-foreground pt-3 pb-3 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 💡 gap-5 대신 gap-x-5 gap-y-2 md:gap-5 를 적용했습니다.
              모바일에서는 위아래 간격(gap-y)이 2로 줄어들어 주소와 메뉴가 바짝 붙게 됩니다. */}
          <div className="grid md:grid-cols-2 gap-x-5 gap-y-2 md:gap-5 mb-3">
            <div>
              <Link href="/about">
                <h3 className="font-bold text-xl mb-0 tracking-tighter whitespace-nowrap hover:text-blue-300 transition cursor-pointer">
                  <span className="text-[18px]">사단법인</span>
                  &nbsp;한국신용카드네트워크
                </h3>
              </Link>
              <p className="text-sm opacity-90 whitespace-nowrap">
                소상공인과&nbsp;함께하는&nbsp;신뢰할&nbsp;수&nbsp;있는&nbsp;파트너
              </p>
              {/* 💡 [수정 내용] 주소 클릭 시 네이버 지도로 연결되도록 링크(a) 추가 및 마우스 호버 효과 부여 */}
              {/* 네이버 맵 href="https://map.naver.com/v5/search/%EC%84%9C%EC%9A%B8%EC%8B%9C%20%EB%A7%88%ED%8F%AC%EA%B5%AC%20%ED%86%A0%EC%A0%95%EB%A1%9C37%EA%B8%B841" */}
              {/* 카카오 맵 href="https://map.kakao.com/?q=서울시%20마포구%20토정로37길41" */}
              <p className="text-[13px] opacity-100 whitespace-nowrap">
                <a 
                  href="https://map.kakao.com/?q=서울시%20마포구%20토정로37길41"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="animate-[pulse_8s_cubic-bezier(0.4,0,0.6,1)_infinite] border-white/50 hover:border-blue-300 hover:text-blue-300 transition-all duration-200 cursor-pointer"
                  title="kakaomap 지도로 보기"
                >
                  서울시&nbsp;마포구&nbsp;토정로37길41,&nbsp;526호&nbsp;(kakao<span className="text-[14px] font-bold">map</span>)
                </a>
              </p>
            </div>
            {/* 💡 md:pt-1을 추가하여 PC 화면에서 왼쪽 타이틀("사단법인...")과 첫 라인의 높이를 맞췄습니다. */}
            <div className="md:pt-1">
              {/* 💡 "연락처" 타이틀 대신 메뉴 링크 배치 */}
              {/* 💡 mb-2 대신 mb-0.5를 주어 하단 이메일 라인과의 간격을 바짝 좁혔습니다 */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] font-semibold mb-0.5 text-white/90">
                <Link href="/" className="hover:text-blue-300 transition-colors">홈</Link>
                <span className="text-xs opacity-40">|</span>
                <Link href="/services" className="hover:text-blue-300 transition-colors">사업</Link>
                <span className="text-xs opacity-40">|</span>
                <Link href="/about" className="hover:text-blue-300 transition-colors">협회소개</Link>
                <span className="text-xs opacity-40">|</span>
                <Link href="/business" className="hover:text-blue-300 transition-colors">정책제언</Link>
                <span className="text-xs opacity-40">|</span>
                <Link href="/ci" className="hover:text-blue-300 transition-colors">CI</Link>
                <span className="text-xs opacity-40">|</span>
                <Link href="/notice" className="hover:text-blue-300 transition-colors">알림마당</Link>
              </div>  
              
              <p className="text-xs opacity-100 whitespace-nowrap mb-0 leading-tight">
                <span className="ml-0">
                  <span className="text-xs opacity-80">이메일 :</span>
                  <a
                    href="mailto:hans344712@gmail.com"
                    className="text-sm animate-[pulse_8s_cubic-bezier(0.4,0,0.6,1)_infinite] ml-1 font-medium border-b border-transparent hover:border-blue-400 hover:text-blue-400 transition-all duration-200"
                  >
                    hans344712@gmail.com
                  </a>
                </span>
              </p>
              <p className="text-xs flex opacity-100 gap-3">
                <div className="text-xs opacity-90 flex items-center whitespace-nowrap">
                  {/* 💡 "전화:" 텍스트만 span으로 감싸서 text-xs(기존 text-sm보다 한 단계 작음)로 축소 */}
                  <span className="text-xs opacity-80">전화 :</span>
                  <a
                    href="tel:027063336"
                    className="text-sm animate-[pulse_8s_cubic-bezier(0.4,0,0.6,1)_infinite] ml-1 font-medium border-b border-transparent hover:border-blue-300 hover:text-blue-300 transition-all duration-200 cursor-pointer"
                    title="전화 걸기"
                  >
                    02-706-3336&nbsp;
                  </a>
                </div>
                <VisitorCounter />
              </p>
              {/*<VisitorCounter />*/}
            </div>
          </div>
          <Link href="/">
            <div className="border-t border-primary-foreground/20 pt-2.5 text-center text-sm opacity-90 whitespace-nowrap hover:text-blue-300 transition cursor-pointer">
              <p>&copy; 2025 한국신용카드네트워크. All rights reserved.</p>
            </div>
          </Link>
          <div className="mt-1 mb-1 flex flex-col items-center gap-1.5">
            <span className="h-[6px] w-full rounded-full bg-gradient-to-r from-[#002B6B] to-[#004EA2]"></span>
            <span className="h-[6px] w-full rounded-full bg-gradient-to-r from-[#005BBB] to-[#007BFF]"></span>
            <span className="h-[6px] w-full rounded-full bg-gradient-to-r from-[#1EAD63] to-[#2ECC71]"></span>
          </div>
        </div>
      </footer>
    </>
  )
}
