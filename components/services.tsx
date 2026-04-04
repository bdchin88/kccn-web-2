"use client";

import { CreditCard, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link"

const services = [
  {
    icon: CreditCard,
    title: "소상공인 전용 VAN 사업",
    description:
      "국내 최저 관리비 정책 시행 및 사용 조건부 무상 임대를 통해 영세 소상공인의 VAN 서비스 소비자 선택권을 확대합니다.",
  },
  {
    icon: Zap,
    title: "소상공인 전용 PG 사업",
    description: "소상공인 PG 사업을 통해 PG 수수료의 60% 이상 인하효과를 유도.",
  },
  {
    icon: TrendingUp,
    title: "신용카드 제도 개선",
    description: "국회 및 정부에 적극적인 정책 제언을 통해 영세가맹점 수수료 인하 등 소상공인 권익을 제고합니다.",
  },
];

export default function Services() {
  // 1. 컨테이너 애니메이션: 자식 요소들이 시간차를 두고 나타나게 설정
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // 다음 요소가 나타나는 간격
        delayChildren: 0.2,    // 전체 시작 전 대기 시간
      },
    },
  };

  // 2. 개별 아이템 애니메이션: 'spring'을 사용하여 더 쫀득하게
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 60 // 시작 위치를 더 낮게 잡아 상승감을 높임
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",      // 물리 기반 애니메이션
        damping: 25,         // 반동 억제력 (높을수록 부드러움)
        stiffness: 100,      // 강성 (낮을수록 부드러움)
        mass: 1,             // 무게감
      },
    },
  };

  return (
    <section id="services" className="py-24 md:py-40 bg-background">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-150px" }} // 화면 하단에서 조금 더 올라왔을 때 시작
        variants={containerVariants}
      >
        {/* 타이틀 영역 */}
        <motion.div variants={itemVariants} className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            주요 사업 영역
          </h2>
          <p className="text-lg text-muted-foreground">
            소상공인을 위한 핵심 서비스
          </p>
        </motion.div>

        {/* 서비스 그리드 영역 */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                // 호버 시에도 부드러운 spring 효과 적용
                whileHover={{ 
                  y: -12,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                className="p-8 bg-card border border-border rounded-xl hover:shadow-lg transition-shadow duration-500"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
