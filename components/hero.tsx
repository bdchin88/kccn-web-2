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

          {/* 좌측 텍스트 영역 (기존 내용 유지) */}
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

          {/* 우측 이미지 및 [기존 placard를 변형한] 팝업 영역 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="md:w-1/2 flex justify-center relative"
          >
    
            {/* 수정 후: overflow-hidden을 삭제 (이미지 모서리는 img 태그에 직접 라운드 적용) */}
            <div className="relative w-full max-w-md bg-background rounded-2xl shadow-2xl border border-slate-100">
              <img
                src="/images/hero.png"
                alt="Hero"
                className="relative z-10 w-full h-auto block rounded-2xl" // 이미지에도 라운드 추가
              />    
    
              {/* ▽ 기존 하단 placard를 이미지 위 팝업으로 변경 ▽ */}
              <AnimatePresence>
                {showPopup && posts.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    /* 📌 팝업창 위치 조정 가이드:
                       - top-80: 위쪽 여백 (수치를 높이면 아래로 내려옴) 을  bottom-10으로 수정
                       - left-4 / right-4: 좌우 여백
                       - z-20: 이미지(z-10)보다 위에 오도록 설정
                    */
                    className="absolute bottom-10 left-4 right-4 z-20 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-blue-100"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-sm text-[#0047AB] flex items-center gap-1.5">
                        <span className="animate-pulse text-xs">📢</span> 공지사항
                      </h3>
                      <button 
                        onClick={() => setShowPopup(false)}
                        className="text-slate-400 hover:text-slate-600 text-xs p-1"
                      >
                        ✕
                      </button>
                    </div>

                    <ul className="space-y-2.5">
                      {posts.map((post) => (
                        <li key={post.id} className="border-b border-slate-50 last:border-0 pb-1.5 last:pb-0">
                          <Link href="/notice" className="block group">
                            <div className="flex justify-between items-start gap-2">
                              <span className="text-xs font-medium text-slate-800 truncate group-hover:text-[#0047AB] transition-colors">
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

                    {/* 전체보기 바로가기 */}
                    <Link 
                      href="/notice" 
                      className="mt-3 inline-flex items-center text-[11px] font-bold text-[#0047AB] hover:underline"
                    >
                      전체 공지 확인하기 →
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Info Badge (기존 내용 유지) */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-slate-100 z-10">
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