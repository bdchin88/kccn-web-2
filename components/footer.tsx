"use client"

import { useRef } from "react"
import VisitorCounter from "./supabase";
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
      <div className="bg-primary text-primary-foreground border-b border-primary-foreground/20 py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative flex overflow-hidden">
            <div className="animate-marquee flex gap-10 items-center">
              {[...partners, ...partners].map((partner, index) => (
                <a
                  key={index}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium hover:text-white/70 transition-colors whitespace-nowrap"
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

      <footer className="bg-primary text-primary-foreground pt-6 pb-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 mb-5">
            <div>
              <Link href="/">
                <h3 className="font-bold text-xl mb-4 tracking-tighter whitespace-nowrap hover:text-blue-300 transition cursor-pointer">
                  사단법인&nbsp;한국신용카드네트워크
                </h3>
              </Link>
              <p className="text-sm opacity-90 whitespace-nowrap">
                소상공인과&nbsp;함께하는&nbsp;신뢰할&nbsp;수&nbsp;있는&nbsp;파트너
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-xl mb-4">연락처</h4>
              <p className="text-sm opacity-90 whitespace-nowrap">
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
          <div className="border-t border-primary-foreground/20 pt-5 text-center text-sm opacity-90">
            <p>&copy; 2025 한국신용카드네트워크. All rights reserved.</p>
          </div>
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
