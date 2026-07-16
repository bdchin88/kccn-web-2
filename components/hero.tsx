//components/hero.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FullBackground from "./FullBackground";
import Link from "next/link";
import { supabase } from "@/lib/supabase"; // ◀ 데이터 연동을 위해 추가

export default function Hero() {
  const [showPopup, setShowPopup] = useState(false);
  const [posts, setPosts] = useState<any[]>([]); // ◀ 공지사항 데이터 상태
  const [heroImage, setHeroImage] = useState(""); // ◀ [개선] 초기값을 빈 문자열로 설정하여 기본 이미지 깜빡임 원천 차단
  const [isImageReady, setIsImageReady] = useState(false); // ◀ [개선] 날짜/날씨 판별이 완료되었는지 확인하는 상태 추가

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

    // 2. 날짜별 hero 이미지 판단 로직 (전체 기념일 2일 적용 고도화)
    const today = new Date();
    
    // 하루 뒤(내일) 날짜 계산 (달이 바뀌는 전날 처리를 자동화하기 위함)
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Date 객체를 "MMDD" 형태의 문자열로 변환하는 함수
    const getMDString = (date: Date) => {
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${month}${day}`;
    };

    const todayMD = getMDString(today);       // 오늘 (예: "0228")
    const tomorrowMD = getMDString(tomorrow); // 내일 (예: "0301")

    // 지정된 모든 특별한 날짜 정의 (삼일절 0301 포함)
    const specialDates = [
      "0101", "0214", "0301", "0303", "0309", "0314", "0505", "0606", 
      "0609", "0717","0815", "0909", "1001", "1009", "1105", "1111", "1223", 
      "1224", "1225", "1231"
    ];

    // 💡 브라우저 및 개발 환경의 강한 캐싱 방지용 타임스탬프
    const cacheBuster = new Date().getTime();

    let targetMD = "";

    // [핵심 로직] 우선순위 판단
    if (specialDates.includes(todayMD)) {
      // 1. '오늘'이 기념일 목록에 있다면 오늘 이미지를 보여줍니다 (당일 우선)
      targetMD = todayMD;
    } else if (specialDates.includes(tomorrowMD)) {
      // 2. '내일'이 기념일 목록에 있다면, 오늘(하루 전)부터 내일 기념일 이미지를 미리 보여줍니다
      targetMD = tomorrowMD;
    }

    if (targetMD) {
      // 기념일 이미지 매핑 (예: 2월 28일 접속 시 내일인 '0301'이 감지되어 h-0301.jpg 로드)
      setHeroImage(`/images/hero/h-${targetMD}.jpg?t=${cacheBuster}`);
      setIsImageReady(true);
    } else {
      // 3. 오늘과 내일 모두 평범한 날일 때만 날씨 API를 호출합니다
      const fetchWeatherWithoutAuth = async () => {
        try {
          // 대한민국 중심 표준 좌표 (서울 타워 기준)
          const latitude = 37.5511;
          const longitude = 126.9882;

          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
          );
          const weatherData = await res.json();
          
          const code = weatherData.current_weather.weathercode;
          
          if ([71, 73, 75, 77, 85, 86].includes(code)) {
            setHeroImage(`/images/hero/h-s.jpg?t=${cacheBuster}`); // 눈 오는 날
          } else if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
            setHeroImage(`/images/hero/h-r.jpg?t=${cacheBuster}`); // 비 오는 날
          } else {
            setHeroImage(`/images/hero/hero.jpg?t=${cacheBuster}`); // 맑거나 흐린 평상시
          }
        } catch (err) {
          setHeroImage(`/images/hero/hero.jpg?t=${cacheBuster}`); // API 오류 시 예외 처리
        } finally {
          setIsImageReady(true); // 최종 이미지 세팅 완료 후 렌더링 허용
        }
      };

      fetchWeatherWithoutAuth(); 
    }
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
      {/* 파티클 배경 전체화면 고정 */}
      <div className="fixed inset-0 z-0 h-full w-full pointer-events-none">
        <FullBackground />
      </div>
      
      {/* 메인 콘텐츠 relative z-10 */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">

          <div className="flex flex-col justify-center md:w-1/2">
            <motion.h1
              {...fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900 leading-tight md:leading-snug lg:leading-snug break-keep">
              소상공인 카드 가맹점<br />
              <span className="lg:whitespace-nowrap">사업자의 든든한 친구!</span>
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
            <div className="relative w-full max-w-md bg-background rounded-2xl shadow-2xl border border-slate-100 min-h-[300px] flex items-center justify-center overflow-hidden">
              
              <motion.img
                src={isImageReady ? heroImage : "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"} 
                alt="Hero"
                className="relative z-10 w-full h-auto block rounded-2xl transition-opacity duration-500"
                style={{ opacity: isImageReady ? 1 : 0 }} 
                key={heroImage} 
              />

              {/* 공지사항 팝업 */}
              <AnimatePresence>
                {showPopup && posts.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute bottom-12 left-12 right-10 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-1 border border-blue-200/60 shadow-[0_25px_60px_rgba(0,0,0,0.6)] ring-1 ring-black/10 animate-in fade-in-0"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-[16px] text-[#0047AB] flex items-center gap-1.5 animate-bounce mt-2">
                        <span className="animate-pulse text-2xl">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;📢</span> &nbsp;공지 사항&nbsp;
                        <span className="inline-block scale-x-[-1] animate-pulse text-2xl">📢</span>
                      </h3>
                      <button 
                        onClick={() => setShowPopup(false)}
                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition-colors">
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

                    <Link 
                      href="/notice" 
                      className="mt-4 flex items-center justify-center w-full py-2 bg-slate-50 hover:bg-blue-200 rounded-lg text-[11px] font-bold text-[#0047AB] transition-colors shadow-inner"
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