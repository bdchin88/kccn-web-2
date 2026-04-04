"use client";

import { Leaf, Cpu, Sparkles } from "lucide-react";
import { motion } from "framer-motion"; // 애니메이션 라이브러리 추가
import Link from "next/link"

const values = [
  {
    icon: Leaf,
    title: "열린 공간 자연",
    description: "국내 700만 소상공인을 위한 열린 정책 대안 제시의 공간",
  },
  {
    icon: Cpu,
    title: "진보한 기술",
    description: "소상공인 관련 정책 실현을 위한 기술 제공 및 구현",
  },
  {
    icon: Sparkles,
    title: "풍요로운 미래",
    description: "윤리경영의 실천, 소상공인 성장 추구 및 합리적 가치 창조",
  },
];

export default function CoreValues() {
  // 1. 컨테이너: 자식 요소(제목, 가치 카드들)가 순차적으로 등장하게 설정
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // 카드 간 등장 간격
      },
    },
  };

  // 2. 개별 아이템: 부드러운 Spring 물리 엔진 적용 (토스 스타일)
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,   // 반동 억제 (부드러움 결정)
        stiffness: 100, // 강성
      },
    },
  };

  return (
    <section className="py-20 md:py-32 bg-secondary/5">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible" // 스크롤 시 감지
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        {/* 타이틀 애니메이션 */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            3대 핵심 가치
          </h2>
        </motion.div>

        {/* 핵심 가치 그리드 애니메이션 */}
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className="text-center"
              >
                {/* 기존 원형 배경 및 아이콘 컬러 유지 */}
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
