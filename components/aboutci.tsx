"use client";

import { motion } from "framer-motion";
import Link from "next/link"

export default function AboutCI() {
  // 1. 공통 위로 솟아오르는 애니메이션 설정
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 100,
        duration: 0.8,
      },
    },
  };

  // 2. 왼쪽/오른쪽 시간차 등장을 위한 컨테이너 설정
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <section className="pb-20 bg-background">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}>
        <div id="ci-intro" className="mb-20 scroll-mt-[96px]">
          {/* 제목 애니메이션 */}
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center"
          >
            CI 소개
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* 왼쪽 로고 이미지 영역 */}
            <motion.div variants={fadeInUp} className="flex justify-center bg-background">
              <img
                src="/images/design-mode/kccn-logo2.png"
                alt="한신네 로고 1"
                className="max-w-xs w-full mix-blend-multiply"
              />
            </motion.div>

            {/* 오른쪽 설명 영역 */}
            <div className="space-y-6">
              {/* 원형 섹션 */}
              <motion.div variants={fadeInUp} className="flex flex-col gap-3">
                <div className="flex items-center gap-1">
                  <div className="relative w-14 h-14 flex-shrink-0">
                    <img
                      src="/images/kccn-earth.png"
                      alt="원형 로고"
                      className="object-contain w-full h-full mix-blend-multiply"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    원형 (The Earth & Circle)
                  </h3>
                </div>
                <p className="text-base font-normal text-muted-foreground leading-relaxed">
                  지구를 형상화한 원은 대한민국 경제의 근간인 중소기업과 소상공인이 하나로 연결된 상호보완적 네트워크를 의미하며,
                  민간 경제 법정단체로서의 단단한 결속력을 표현합니다.
                </p>
              </motion.div>

              {/* 비상 섹션 */}
              <motion.div variants={fadeInUp} className="flex flex-col gap-3">
                <div className="flex items-center gap-1">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <img
                      src="/images/kccn-wing.png"
                      alt="비상"
                      className="object-contain w-full h-full mix-blend-multiply"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    비상 (Dynamic Flight)
                  </h3>
                </div>
                <p className="text-base font-normal text-muted-foreground leading-relaxed">
                  위를 향해 솟구치는 날개의 곡선은 변화와 혁신을 통한 진취적인 기상을 나타냅니다.
                </p>
              </motion.div>

              {/* 컬러 리스트 섹션 */}
              <motion.div variants={fadeInUp}>
                <h3 className="text-xl font-bold text-foreground mb-4">3개의 날개는</h3>
                <ul className="space-y-2">
                  <li className="flex gap-3">
                    <span className="inline-block w-4 h-4 rounded bg-blue-900 flex-shrink-0 mt-1"></span>
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">코발트블루</span> –{" "}
                      <span className="font-medium text-blue-900">Future-Cobalt</span> | 풍요로운 미래와 신뢰
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="inline-block w-4 h-4 rounded bg-blue-500 flex-shrink-0 mt-1"></span>
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">블루</span> –{" "}
                      <span className="font-medium text-blue-500">Digital-Blue</span> | 진보한 기술과 정보화
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="inline-block w-4 h-4 rounded bg-green-500 flex-shrink-0 mt-1"></span>
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">그린</span> –{" "}
                      <span className="font-medium text-green-500">Eco-Green</span> | 열린 공간과 상생
                    </span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 p-8 rounded-xl border border-primary/20">
          <ul className="space-y-4">
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span className="text-muted-foreground">사단법인 한국신용카드네트워크(KCCN)는 대한민국 소상공인과 신용카드 가맹점 사업자의 권익을 보호하고 공정한 카드 결제 환경을 조성하기 위해 설립된 비영리 경제 법정단체입니다. 본 단체는 전국 소상공인과 자영업자의 경제적 지위 향상을 목표로 다양한 정책 제안과 제도 개선 활동을 수행하며, 카드 결제 산업의 건전한 발전과 공정한 시장 질서를 구축하는 데 기여하고 있습니다.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span className="text-muted-foreground">한국신용카드네트워크는 정부, 국회, 금융기관, 카드사, 결제 관련 산업과의 협력 네트워크를 기반으로 소상공인 카드 가맹점의 현실적인 문제를 정책에 반영하고, 지속 가능한 결제 생태계 구축을 위한 다양한 연구와 사업을 추진하고 있습니다. 또한 신용카드 결제와 관련된 기술 및 서비스 개선을 통해 소상공인의 경영 환경을 개선하고 경쟁력을 높이는 데 앞장서고 있습니다.</span>
            </li>
          </ul>
        </div>



      </motion.div>
    </section>
  );
}
