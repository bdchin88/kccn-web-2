"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FullBackground from "./FullBackground";
import Link from "next/link";
import { supabase } from "@/lib/supabase"; // ◀ 데이터 연동을 위해 추가

export default function Hero() {
  const [showPopup, setShowPopup] = useState(false);
  const [posts, setPosts] = useState<any[]>([]); // ◀ 공지사항 데이터 상태

  // [기존 placard.tsx의 로직을 useEffect로 통합]
  useEffect(() => {
    const fetchNotices = async () => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("type", "notice")
        .or(`expiry_date.is.null,expiry_date.gt.${now}`)
        .order("created_at", { ascending: false })
        .limit(3);

      if (!error && data) {
        setPosts(data);
        if (data.length > 0) setShowPopup(true); // 데이터가 있을 때만 팝업 노출
      }
    };
    fetchNotices();
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <section
      id="home"
      className="relative min-h-[50px] py-20 md:py-32 bg-background overflow-hidden">
      
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
            {/* 📌 중요: 팝업 그림자가 잘리지 않도록 overflow-hidden을 제거함 */}
            <div className="relative w-full max-w-md bg-background rounded-2xl shadow-2xl border border-slate-100">
              <img
                src="/images/hero.png"
                alt="Hero"
                className="relative z-10 w-full h-auto block rounded-2xl"
              />

              {/* ▽ 기존 하단 placard를 이미지 위 팝업으로 변경 ▽ */}
              <AnimatePresence>
                {showPopup && posts.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    /* 📌 팝업창 위치 조정 가이드:
                       - top-40: 위쪽 여백 (수치를 높이면 아래로 내려옴, 현재 160px)
                       - left-4 / right-4: 좌우 여백
                       - z-20: 이미지(z-10)보다 위에 오도록 설정
                       
                       📌 그림자 효과 가이드 (짙게 수정됨):
                       - shadow-[0_25px_60px_rgba(0,0,0,0.5)]: 아주 짙고 묵직한 하단 그림자 (농도 50%)
                       - ring-1 ring-black/10: 팝업 테두리를 더 선명하게 잡아주는 미세 외곽선 (농도 10%)
                        className="absolute top-40 을 bottom-10
                       */
                    className="absolute bottom-12 left-12 right-10 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-1 border border-blue-200/60 shadow-[0_25px_60px_rgba(0,0,0,0.6)] ring-1 ring-black/10 animate-in fade-in-0"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-sm text-[#0047AB] flex items-center gap-1.5">
                        <span className="animate-pulse text-xs">📢</span> 공지사항
                      </h3>
                      <button 
                        onClick={() => setShowPopup(false)}
                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <ul className="space-y-3">
                      {posts.map((post) => (
                        <li key={post.id} className="border-b border-slate-50 last:border-0 pb-2 last:pb-0">
                          <Link href="/notice" className="block group">
                            <div className="flex justify-between items-start gap-2">
                              <span className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-[#0047AB] transition-colors">
                                {post.title}
                              </span>
                              <span className="text-[10px] text-slate-400 shrink-0 mt-0.5">
                                {new Date(post.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            {post.location && (
                              <p className="text-[10px] text-slate-500 mt-0.5">📍 {post.location}</p>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {/* 전체보기 바로가기 버튼화 */}
                    <Link 
                      href="/notice" 
                      className="mt-4 flex items-center justify-center w-full py-2 bg-slate-50 hover:bg-blue-50 rounded-lg text-[11px] font-bold text-[#0047AB] transition-colors shadow-inner"
                    >
                      전체 공지 확인하기 →
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section >
  );
}