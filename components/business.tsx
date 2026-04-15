"use client";

import { motion } from "framer-motion";
import Link from "next/link"

export default function Business() {
  // 1. 개별 요소가 아래에서 위로 부드럽게 올라오는 설정
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 100,
        duration: 0.8
      }
    }
  };

  // 2. 전체적인 섹션 등장 시점 관리 (Stagger 효과)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // 제목 -> 설명 -> 성과 박스 순으로 등장
        delayChildren: 0.1
      }
    }
  };

  return (
    <section className="py-32 md:py-32 bg-secondary/5">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}>
        {/* 상단 텍스트 영역 */}
        <div className="text-center mb-16">
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-foreground mb-6"
          >
            제도 개선으로 만드는 변화
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            국회, 정부, 카드사 등 유관 기관을 대상으로 적극적인 정책 제언과 대변 활동을 펼치고 있습니다. 소상공인의
            목소리를 정책에 반영하여 실질적인 경영 환경 개선을 이끌어냅니다.
          </motion.p>
        </div>

        {/* 주요 성과 박스 영역 (디자인 유지) */}
        <motion.div 
          variants={fadeInUp}
          whileHover={{ scale: 1.01 }} // 미세한 호버 효과만 추가
          className="max-w-4xl mx-auto bg-gradient-to-br from-primary/5 to-secondary/10 border-2 border-primary/20 rounded-2xl p-8 md:p-12 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 text-primary">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
                />
              </svg>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">주요성과 및 제도개선 활동</h3>
          </div>

          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p className="text-base md:text-lg">
              국회 공청회등 제언을 통해 영세가맹점 수수료를 0.4%까지 인하하는 실질적인 성과를 이끌어냈으며, 이는 전국 소상공인의 수수료 부담을 덜어드리는 실질적인 제도 개선에 앞장섭니다.
            </p>
            <p className="text-base md:text-lg">또한 국회에 정책 제안을 하여 결제구조의 개선을 유도하며, 법령 일부개정을 하여 소상공인 PG 수수료 인하 사업에 앞장서겠습니다.</p>
            <p className="text-base md:text-lg">
              한국신용카드네트워크는 국회와 정부 기관을 대상으로 소상공인의 현실적인 어려움을 전달하고, 카드 결제 제도의 합리적인 개선을 위한 정책 제안을 지속적으로 수행하고 있습니다. 이러한 활동은 영세 가맹점의 카드 수수료 부담을 완화하고 보다 공정한 결제 시장을 조성하는 데 중요한 역할을 하고 있습니다.
            </p>
            <p className="text-base md:text-lg">또한 관련 산업과의 협력을 통해 결제 시스템의 효율성을 높이고, 기술 발전과 정책 개선을 동시에 추진함으로써 소상공인에게 실질적인 도움이 되는 결제 환경을 구축하고 있습니다.</p>
          </div>

        </motion.div>

        {/* 주요 성과 박스 영역 (디자인 유지) */}
        <motion.div 
          variants={fadeInUp}
          whileHover={{ scale: 1.01 }} // 미세한 호버 효과만 추가
          className="max-w-4xl mx-auto bg-gradient-to-br from-primary/5 to-secondary/10 border-2 border-primary/20 rounded-2xl p-8 md:p-12 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 text-primary">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
                />
              </svg>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">소상공인을 위한 결제 환경 개선</h3>
          </div>

          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p className="text-base md:text-lg">
              대한민국에는 수백만 개의 소상공인 사업자가 신용카드 가맹점으로 등록되어 있으며, 카드 결제는 현대 상거래에서 필수적인 결제 수단으로 자리 잡고 있습니다. 한국신용카드네트워크는 이러한 소상공인들이 보다 공정하고 합리적인 결제 환경에서 사업을 운영할 수 있도록 다양한 제도 개선과 정책 활동을 추진하고 있습니다.
            </p>
            <p className="text-base md:text-lg"> 기존 결제시스템과의 차별화를 목표로 하는 정책을 수립하여, 수수료 인하 환경을 조성하고 있으며, 특히 카드 수수료 부담 완화, 결제 단말기 환경 개선, VAN 및 PG 서비스의 효율적인 운영 등 다양한 분야에서 소상공인에게 실질적인 도움이 되는 사업을 추진하고 있으며, 이를 통해 소상공인의 경영 안정성과 경쟁력을 높이고자 노력하고 있습니다.</p>
          </div>

        </motion.div>

      </motion.div>
    </section>
  );
}
