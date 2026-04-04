"use client"

import Link from "next/link"
export default function About() {
  return (
    <section id="about" className="py-20 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-12 text-center">협회 소개</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">사단법인 한국신용카드네트워크</span>는 우리나라 자영업
                대표들의 정치·사회적 권익을 대변하는 전문 경제 법정단체입니다.
              </p>
              <p>
                <span className="font-semibold text-foreground">설립일:</span> 2010년 3월 9일
              </p>
              <p>
                <span className="font-semibold text-foreground">인가:</span> 중소벤처기업부 제2010-3호 인가 법정 단체 등록
              </p>
              <p>
                <span className="font-semibold text-foreground">규모:</span> 전국 138개 관리지부, 207만 개 자영업 대표 회원
              </p>
            </div>
          </div>
          <div className="bg-primary/5 p-8 rounded-xl border border-primary/20">
            <h3 className="text-2xl font-bold text-foreground mb-6">설립 목적</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span className="text-muted-foreground">소상공인 카드가맹점 사업자의 경제적 지위 향상과 권익 보호</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span className="text-muted-foreground">중소상공인 보호를 위한 제반 사업 발굴 및 지원</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span className="text-muted-foreground">
                  정보화 사업 추진 및 기술 혁신
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-primary/5 p-8 rounded-xl border border-primary/20">
          <h3 className="text-2xl font-bold text-foreground mb-6">협회 비젼과 역할</h3>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span className="text-muted-foreground">한국신용카드네트워크는 소상공인과 카드 가맹점 사업자가 안정적으로 성장할 수 있는 공정한 결제 환경을 구축하는 것을 목표로 하고 있습니다. 이를 위해 다양한 정책 연구와 산업 협력을 통해 결제 산업의 발전 방향을 제시하고, 소상공인의 권익을 보호하는 활동을 지속적으로 추진하고 있습니다.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span className="text-muted-foreground">앞으로도 한국신용카드네트워크는 소상공인과 함께 성장하는 신뢰받는 법정 단체로서, 공정하고 투명한 결제 생태계를 조성하고 대한민국 소상공인의 지속 가능한 발전을 위해 최선을 다할 것입니다.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span className="text-muted-foreground">한국신용카드네트워크는 국내 소상공인과 신용카드 가맹점 사업자를 대표하는 법정 단체로서 카드 결제 제도의 합리적인 개선과 소상공인의 경제적 권익 보호를 위해 다양한 활동을 수행하고 있습니다. 특히 카드 수수료 정책 개선, 결제 인프라 지원, 정책 연구 및 제안 활동을 통해 소상공인의 안정적인 경영 환경을 조성하는 데 기여하고 있습니다.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span className="text-muted-foreground">또한 카드 결제 시스템과 관련된 다양한 사업을 통해 가맹점의 비용 부담을 줄이고 효율적인 결제 환경을 구축하고 있습니다. 이러한 활동은 소상공인의 경쟁력 향상과 함께 국내 결제 산업의 건전한 발전에도 중요한 역할을 하고 있습니다.</span>
            </li>
          </ul>
        </div>

      </div>
    </section>
  )
}
