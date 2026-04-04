"use client"

import { useState, useEffect } from "react"
import { X, Pointer, Fingerprint } from "lucide-react"
import Link from "next/link"

export default function About1() {
  const [selectedDocument, setSelectedDocument] = useState<{ title: string; subtitle?: string; image: string } | null>(null)

    useEffect(() => {
      if (selectedDocument) {
        window.history.pushState({ modal: "open" }, "");
        const handlePopState = () => setSelectedDocument(null);
        window.addEventListener("popstate", handlePopState);
        return () => {
          window.removeEventListener("popstate", handlePopState);
          if (window.history.state?.modal === "open") window.history.back();
        };
      }
    }, [selectedDocument]);

    return (
    <section className="pb-20 md:pb-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5 text-center">주요인증 및 협력현황</h2>
          <p className="flex items-center justify-center gap-2 text-center text-[13px] text-muted-foreground mb-4">
          <Pointer size={26} className="text-primary animate-bounce rotate-180" />
          각 항목을 터치하시면 원본 이미지를 확인하실 수 있습니다
          </p>
          {/* ... 정부 인가, 보안 인증 버튼들 (기존과 동일) ... */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Government Certifications */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground">정부 인가 및 허가</h3>
              </div>
              <div className="grid md:grid-cols-1 gap-4">
                <button
                  onClick={() =>
                    setSelectedDocument({
                      title: "법인설립 허가증",
                      subtitle: "중소벤처기업부",
                      image: "/images/gov-01.png",
                    })
                  }
                  className="bg-background rounded-xl p-5 border-2 border-primary/40 shadow-lg active:scale-95 active:bg-primary/10 transition-all text-left w-full md:bg-background/80 md:border-primary/20 md:shadow-md md:hover:border-primary/50 md:hover:shadow-xl"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">01</span>
                    <div>
                      <p className="font-semibold text-foreground mb-1">법인설립 허가증</p>
                      <p className="text-sm text-muted-foreground">중소벤처기업부</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() =>
                    setSelectedDocument({
                      title: "공익법인 지정기부금단체",
                      subtitle: "기획재정부",
                      image: "/images/gov-02.png",
                    })
                  }
                  className="bg-background rounded-xl p-5 border-2 border-primary/40 shadow-lg active:scale-95 active:bg-primary/10 transition-all text-left w-full md:bg-background/80 md:border-primary/20 md:shadow-md md:hover:border-primary/50 md:hover:shadow-xl"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">02</span>
                    <div>
                      <p className="font-semibold text-foreground mb-1">공익법인 지정기부금단체</p>
                      <p className="text-sm text-muted-foreground">기획재정부</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() =>
                    setSelectedDocument({
                      title: "부가통신업(VAN사) 등록 승인",
                      subtitle: "금융감독원",
                      image: "/images/gov-03.png",
                    })
                  }
                  className="bg-background rounded-xl p-5 border-2 border-primary/40 shadow-lg active:scale-95 active:bg-primary/10 transition-all text-left w-full md:bg-background/80 md:border-primary/20 md:shadow-md md:hover:border-primary/50 md:hover:shadow-xl"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">03</span>
                    <div>
                      <p className="font-semibold text-foreground mb-1">부가통신업(VAN사) 등록 승인</p>
                      <p className="text-sm text-muted-foreground">금융감독원</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() =>
                    setSelectedDocument({
                      title: "현금영수증사업자 승인서",
                      subtitle: "국세청",
                      image: "/images/tax.png",
                    })
                  }
                  className="bg-background rounded-xl p-5 border-2 border-primary/40 shadow-lg active:scale-95 active:bg-primary/10 transition-all text-left w-full md:bg-background/80 md:border-primary/20 md:shadow-md md:hover:border-primary/50 md:hover:shadow-xl"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">04</span>
                    <div>
                      <p className="font-semibold text-foreground mb-1">현금영수증사업자 승인서</p>
                      <p className="text-sm text-muted-foreground">국세청</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Government Support */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🏛️</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground">정부 공문 및 협약</h3>
              </div>
              <div className="grid md:grid-cols-1 gap-4">
                <button
                  onClick={() =>
                    setSelectedDocument({
                      title: "중소벤처기업부 공문",
                      subtitle: "중소기업 협력 공문",
                      image: "/images/gov-08.png",
                    })
                  }
                  className="bg-background rounded-xl p-5 border-2 border-primary/40 shadow-lg active:scale-95 active:bg-primary/10 transition-all text-left w-full md:bg-background/80 md:border-primary/20 md:shadow-md md:hover:border-primary/50 md:hover:shadow-xl"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">01</span>
                    <div>
                      <p className="font-semibold text-foreground mb-1">중소벤처기업부 공문</p>
                      <p className="text-sm text-muted-foreground">중소기업 협력 공문</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() =>
                    setSelectedDocument({
                      title: "금융위원회 공문",
                      subtitle: "IC 단말기 사업 관련 협력 승인",
                      image: "/images/gov-05.png",
                    })
                  }
                  className="bg-background rounded-xl p-5 border-2 border-primary/40 shadow-lg active:scale-95 active:bg-primary/10 transition-all text-left w-full md:bg-background/80 md:border-primary/20 md:shadow-md md:hover:border-primary/50 md:hover:shadow-xl"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">02</span>
                    <div>
                      <p className="font-semibold text-foreground mb-1">금융위원회 공문</p>
                      <p className="text-sm text-muted-foreground">IC 단말기 사업 관련 협력 승인</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() =>
                    setSelectedDocument({
                      title: "소상공인연합회 업무제휴협약서",
                      subtitle: "소상공인 지원 협약",
                      image: "/images/gov-06.png",
                    })
                  }
                  className="bg-background rounded-xl p-5 border-2 border-primary/40 shadow-lg active:scale-95 active:bg-primary/10 transition-all text-left w-full md:bg-background/80 md:border-primary/20 md:shadow-md md:hover:border-primary/50 md:hover:shadow-xl"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">03</span>
                    <div>
                      <p className="font-semibold text-foreground mb-1">소상공인연합회 업무제휴협약서</p>
                      <p className="text-sm text-muted-foreground">소상공인 지원 협약</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() =>
                    setSelectedDocument({
                      title: "일자리창출 업무협약",
                      subtitle: "고용노동부, 노사발전재단, 여신금융협회",
                      image: "/images/gov-07.png",
                    })
                  }
                  className="bg-background rounded-xl p-5 border-2 border-primary/40 shadow-lg active:scale-95 active:bg-primary/10 transition-all text-left w-full md:bg-background/80 md:border-primary/20 md:shadow-md md:hover:border-primary/50 md:hover:shadow-xl"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">04</span>
                    <div>
                      <p className="font-semibold text-foreground mb-1">일자리창출 업무협약</p>
                      <p className="text-sm text-muted-foreground">고용노동부, 노사발전재단, 여신금융협회</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Security Certification */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground">보안 인증</h3>
              </div>
              <div className="grid md:grid-cols-1 gap-4">
                <button
                  onClick={() =>
                    setSelectedDocument({
                      title: "KSEL 결제장비 보안인증",
                      subtitle: "영세가맹점 IC단말기",
                      image: "/images/ksel.png",
                    })
                  }
                  className="bg-background rounded-xl p-5 border-2 border-primary/40 shadow-lg active:scale-95 active:bg-primary/10 transition-all text-left w-full md:bg-background/80 md:border-primary/20 md:shadow-md md:hover:border-primary/50 md:hover:shadow-xl"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">01</span>
                    <div>
                      <p className="font-semibold text-foreground mb-1">KSEL 결제장비 보안인증</p>
                      <p className="text-sm text-muted-foreground">영세가맹점 IC단말기</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5 text-center">특허 보유 현황</h2>
          {/* ... 특허 버튼들 (기존과 동일) ... */}
          <p className="flex items-center justify-center gap-2 text-center text-[13px] text-muted-foreground mb-4 min-h-[30px]">  
          <Pointer size={26} className="text-primary animate-bounce rotate-180" />
          각 항목을 터치하시면 원본 이미지를 확인하실 수 있습니다
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <button
              onClick={() =>
                setSelectedDocument({
                  title: "특허 제10-1508613호",
                  subtitle: "고객이 서명한 신용카드 매출 전표 온라인 회수 시스템",
                  image: "/images/10-1508613.jpeg",
                })
              }
              className="bg-primary/5 backdrop-blur rounded-lg p-4 border-2 border-primary/20 shadow-md active:scale-95 active:bg-primary/10 hover:border-primary/60 transition-all text-left w-full"
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="text-primary font-bold text-xl">01</span>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">특허 제10-1508613호</h3>
                  <p className="text-sm text-muted-foreground tracking-tight leading-relaxed">고객이 서명한 신용카드 매출 전표 온라인 회수 시스템</p>
                  <p className="text-xs text-muted-foreground mt-2">등록일: 2015.04.07</p>
                </div>
              </div>
            </button>

            <button
              onClick={() =>
                setSelectedDocument({
                  title: "특허 제10-1561252호",
                  subtitle: "단말기 변경없이 밴사 변경을 지원하는 신용 조회 단말기",
                  image: "/images/10-1561252.jpeg",
                })
              }
              className="bg-primary/5 backdrop-blur rounded-lg p-4 border-2 border-primary/20 shadow-md active:scale-95 active:bg-primary/10 hover:border-primary/60 transition-all text-left w-full"
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="text-primary font-bold text-xl">02</span>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">특허 제10-1561252호</h3>
                  <p className="text-sm text-muted-foreground tracking-tight leading-relaxed">단말기 변경없이 밴사 변경을 지원하는 신용조회 단말기</p>
                  <p className="text-xs text-muted-foreground mt-2">등록일: 2015.10.12</p>
                </div>
              </div>
            </button>

            <button
              onClick={() =>
                setSelectedDocument({
                  title: "특허 제10-1739358호",
                  subtitle: "신용카드매출전표의 모바일 서명운영방법 및 그 시스템",
                  image: "/images/10-1739358.jpeg",
                })
              }
              className="bg-primary/5 backdrop-blur rounded-lg p-4 border-2 border-primary/20 shadow-md active:scale-95 active:bg-primary/10 hover:border-primary/60 transition-all text-left w-full"
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="text-primary font-bold text-xl">03</span>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">특허 제10-1739358호</h3>
                  <p className="text-sm text-muted-foreground tracking-tight leading-relaxed">신용카드매출전표의 모바일 서명운영방법 및 그 시스템</p>
                  <p className="text-xs text-muted-foreground mt-2">등록일: 2017.05.18</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Document Preview Modal */}
        {selectedDocument && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelectedDocument(null)}>
            <div className="bg-background max-w-3xl w-full max-h-[90vh] overflow-auto p-4 rounded-lg relative" onClick={(e) => e.stopPropagation()}>
              <button className="absolute top-2 right-2 p-2 hover:bg-muted rounded-full transition-colors" onClick={() => setSelectedDocument(null)}>
                <X className="h-6 w-6" />
              </button>
              <img src={selectedDocument.image || "/placeholder.svg"} alt={selectedDocument.title} className="w-full h-auto rounded-md shadow-lg" />
              <p className="mt-4 text-center font-bold text-lg">{selectedDocument.title}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
