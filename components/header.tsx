"use client"

import { useState } from "react"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import Link from "next/link"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* 스크린 상단과 헤더 사이 여백 – 절반으로 축소 */}
      <div className="h-1.5" />
      {/* 헤더 하단 그림자 // 더 무겁게  _0_36px_72px_rgba(0,0,0,0.52) // 조금만 덜 과하게  _0_28px_56px_rgba(0,0,0,0.42) */}
      {/* y-offset: 44px (훨씬 아래) blur: 96px (바닥에 퍼짐) opacity: 0.65 (확실히 진함)  */}
      {/* 그림자 진함shadow-[0_6px_0_rgba(0,0,0,0.32),_0_44px_96px_rgba(0,0,0,0.65)]  */}
      {/* 그림자 진함 현재 shadow-[0_6px_0_rgba(0,0,0,0.31),_0_38px_80px_rgba(0,0,0,0.56)  */}
      <header
        className="
          relative
          sticky top-2 z-50
          bg-[#0047AB]
          shadow-[0_6px_0_rgba(0,0,0,0.31),_0_38px_80px_rgba(0,0,0,0.56)]
          before:absolute before:left-0 before:bottom-[-4px]
          before:w-full before:h-[6px]
          before:bg-[#003580]
          before:z-[-1]
        "
      >
      {/* before=헤더의아랫면, h-[10px]=z축두께, bottom-[-10px]=본체아래로튀어나옴: bottom-[-10px] before:h-[5px] before:bg-[#002f6c]  // 더 무거움 */}

        {/* 윗면의 빛 반사: 윗면 하이라이트 – 거의 보이지 않게 */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-white/10" />

        <div className="max-w-7xl mx-auto px-6">
          {/* 헤더 두께 증가 */}
          <div className="flex justify-between items-center h-[80px]">
            {/* 로고 액자 */}
            <Link href="/#ci-intro" className="flex items-center cursor-pointer">            
              <div
                className="
                  bg-[#003d99]
                  px-5 py-2.5
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]
                  transition-all duration-150 ease-out
                  active:translate-y-[2px]
                  active:shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]
                "
                >
                <Image
                  src="/images/design-mode/kccn-logo.png"
                  alt="한국신용카드네트워크 로고"
                  width={190}
                  height={38}
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* PC 메뉴 */}
            <nav className="hidden md:flex gap-10">
              {[
                { href: "/", label: "홈" },
                { href: "/services", label: "사업" },
                { href: "/about", label: "협회소개" },
                { href: "/business", label: "정책제언" },
                { href: "/ci", label: "CI" },
                { href: "/notice", label: "알림마당" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="
                    relative text-white font-semibold
                    tracking-tight
                    after:absolute after:left-0 after:-bottom-2
                    after:h-[3px] after:w-0 after:bg-white
                    hover:after:w-full
                    after:transition-all after:duration-200
                  "
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* 모바일 버튼 */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white"
              aria-label="메뉴"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

          {/* 모바일 메뉴 */}
          {isOpen && (
            <nav className="md:hidden pb-4 pt-2 flex flex-col gap-3">
              {[
                { href: "/", label: "홈" },
                { href: "/services", label: "사업" },
                { href: "/about", label: "협회소개" },
                { href: "/business", label: "정책제언" },
                { href: "/ci", label: "CI" },
                { href: "/notice", label: "알림마당" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white font-medium px-3 py-2 hover:bg-white/10"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>
    </>
  )
}

// <div className="h-3" /> sticky top-3 👉 절반 수준으로 축소
// h-3 → h-1.5
// top-3 → top-2

// → “떠 있음”은 유지, 스크롤 비침 최소화

// 헤더 두께 소폭 증가  현재:
// tsx 코드 복사  h-[72px] 👉 +8px
// tsx 코드 복사  h-[80px]  → 로고 액자 비례가 자연스러워짐

//헤더 하단 그림자
// 더 무겁게  _0_36px_72px_rgba(0,0,0,0.52)
// 조금만 덜 과하게  _0_28px_56px_rgba(0,0,0,0.42)
