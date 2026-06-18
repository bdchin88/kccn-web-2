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

    // 2. 날짜별 hero 이미지 판단 로직 (6월 9일 육우데이 추가)
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const date = String(today.getDate()).padStart(2, "0");
    const mdString = `${month}${date}`; // 예: "0301", "0609"
    //const mdString = "0301"; // 예: "0301", "0609" 테스트

    // 지정된 10개의 특정 날짜 정의 (6월 9일 육우데이 추가됨)
    const specialDates = ["0101", "0214", "0301", "0303", "0309", "0314", "0505", "0606", "0609", "0815", "0909", "1001", "1009", "1105", "1111", "1223", "1224", "1225", "1231"];

    // 💡 브라우저 및 localhost 개발 환경의 강한 캐싱 때문에 이미지가 돌아오지 않는 현상 방지 
    const cacheBuster = new Date().getTime();

    // 19개 특정 날짜에 해당할 경우 날짜 우선 적용
    if (specialDates.includes(mdString)) {
      setHeroImage(`/images/hero/h-${mdString}.jpg?t=${cacheBuster}`);
      setIsImageReady(true); // ◀ 판별 완료
    } else {
      // 💡 기기별 GPS 승인 인증창을 띄우지 않도록 국가지정 대표 좌표(서울 중심선)로 날씨를 바로 요청합니다.
      const fetchWeatherWithoutAuth = async () => {
        try {
          // 대한민국 중심 표준 좌표 (서울 타워 기준: 위도 37.5511, 경도 126.9882)
          const latitude = 37.5511;
          const longitude = 126.9882;

          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
          );
          const weatherData = await res.json();
          
          // WMO Weather interpretation codes (weathercode) 분석
          // 51~67, 80~82: 비(Rain/Drizzle/Shower)
          // 71~77, 85~86: 눈(Snow)
          // 💡 [테스트 안내] 비 모드를 테스트하려면 바로 아래 줄을 주석 해제하고 const code = 61; 로 테스트하세요!
          const code = weatherData.current_weather.weathercode;
          //const code = 71; // ◀ 테스트를 위해 눈(Snow) 코드로 강제 고정!
          //const code = 61; // ◀ 테스트를 위해 비(Rain) 코드로 강제 고정!
          
          if ([71, 73, 75, 77, 85, 86].includes(code)) {
            setHeroImage(`/images/hero/h-s.jpg?t=${cacheBuster}`); // 눈 오는 날
          } else if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
            setHeroImage(`/images/hero/h-r.jpg?t=${cacheBuster}`); // 비 오는 날
          } else {
            setHeroImage(`/images/hero/hero.jpg?t=${cacheBuster}`); // 맑거나 흐린 평상시
          }
        } catch (err) {
          setHeroImage(`/images/hero/hero.jpg?t=${cacheBuster}`); // API 오류 발생 시 예외 처리
        } finally {
          setIsImageReady(true); // ◀ 성공하든 실패하든 최종 이미지 세팅이 끝나면 렌더링 허용
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
      {/* <div className="absolute inset-0 z-0 h-full w-full pointer-events-none"> */}
      {/* 💡 변경: 파티클을 hero 영역에 가두지 않고 브라우저 전체화면 고정(fixed)으로 변경 */}
      <div className="fixed inset-0 z-0 h-full w-full pointer-events-none">
        <FullBackground />
      </div>

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
            {/* 📌 중요: 팝업 그림자가 잘리지 않도록 overflow-hidden을 제거함 */}
            <div className="relative w-full max-w-md bg-background rounded-2xl shadow-2xl border border-slate-100 min-h-[300px] flex items-center justify-center overflow-hidden">
              
              {/* 💡 [개선] 이미지가 준비되기 전에는 레이아웃을 유지하는 스켈레톤/로딩 공백을 보여주고, 
                  준비가 완료되면 framer-motion을 통해 투명도(opacity)가 부드럽게 켜지도록 하여 깜빡임을 완벽히 해결했습니다. */}
              <motion.img
                src={isImageReady ? heroImage : "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"} // 준비 전엔 1px 투명 이미지
                alt="Hero"
                className="relative z-10 w-full h-auto block rounded-2xl transition-opacity duration-500"
                style={{ opacity: isImageReady ? 1 : 0 }} // 준비되면 서서히 나타남
                key={heroImage} /* 💡 이미지 경로 변경 시 브라우저가 즉시 주소를 갱신하도록 key 지정 */
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
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-[16px] text-[#0047AB] flex items-center gap-1.5 animate-bounce mt-2">
                        <span className="animate-pulse text-2xl">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;📢</span> &nbsp;공지 사항&nbsp;
                        {/* 💡 inline-block과 scale-x-[-1]을 추가하여 기존 애니메이션을 유지한 채 반전 */}
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

                    {/* 전체보기 바로가기 버튼화 */}
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