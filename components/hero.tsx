"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FullBackground from "./FullBackground";
import Link from "next/link"

export default function Hero() {
  const [showPopup, setShowPopup] = useState(false);
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <section
      id="home"
      className="relative min-h-[50px] py-20 md:py-32 bg-background overflow-hidden">
      {/* [레이어 2] 커스텀 팝업: 레이어 최상단 (z-50) */}

      <div className="absolute inset-0 z-0 h-full w-full pointer-events-none">
        <FullBackground />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">

          <div className="flex flex-col justify-center md:w-1/2">
            <motion.h1
              {...fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900 leading-tight">
              소상공인 카드가맹점<br />사업자의 든든한 친구!
            </motion.h1>

            <motion.p
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: 0.2 }}
              className="text-xl mb-4 text-slate-700">
              1년 365일 한국 자영업 대표와 함께 합니다. BUSINESS PARTNER
            </motion.p>

            <motion.p
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: 0.4 }}
              className="text-lg font-semibold text-slate-600">
              전국 700만 소상공인의 경제적 지위 향상과 권익 보호를 위해 설립된 법정 대표단체입니다.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="md:w-1/2 flex justify-center relative"
          >
            <div className="relative w-full max-w-md bg-background rounded-2xl overflow-hidden shadow-2xl border border-slate-100">
              <img
                src="/images/hero.png"
                alt="Hero"
                className="relative z-10 w-full h-auto block"
              />
              {/* Info Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0047AB] rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">한국신용카드네트워크</p>
                    <p className="text-xs text-slate-500">소상공인과 함께하는 동반자</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section >
  );
}