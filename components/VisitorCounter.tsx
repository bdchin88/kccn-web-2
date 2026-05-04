// components/VisitorCounter.tsx
"use client"

import React, { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { logVisitorDetail } from "@/lib/visitor"; // ◀ 로그 수집 함수 임포트
import { checkAdminLock, recordFailAttempt, resetAuthAttempts } from "@/lib/auth"; // ◀ 보안 공통 함수 추가

export default function VisitorCounter() {
  const [totalHits, setTotalHits] = useState<number>(0)
  const [yesterdayHits, setYesterdayHits] = useState<number>(0)
  const [showPwInput, setShowPwInput] = useState(false); // 비밀번호 입력 모달 제어
  const [tempPw, setTempPw] = useState(""); // 입력 중인 비밀번호
  const router = useRouter();

  // 전일 방문자수 클릭 시 관리자 인증 모달 활성화
  const handleAdminAccess = () => {
    // 📌 [보안 추가] 잠금 상태인지 먼저 확인
    const lockStatus = checkAdminLock();
    if (lockStatus.isLocked) {
      alert(`보안상 이유로 인증이 제한되었습니다. ${lockStatus.remaining}초 후 다시 시도하세요.`);
      return;
    }
    
    // 기존 prompt 대신 보안과 레이아웃을 위해 커스텀 모달 사용
    setShowPwInput(true);
  };

  // 비밀번호 확인 및 이동 로직
  const confirmAccess = (e: React.FormEvent) => {
    e.preventDefault();

    // 📌 [보안 추가] 인증 시도 전 다시 한번 잠금 체크
    const lockStatus = checkAdminLock();
    if (lockStatus.isLocked) {
      alert(`제한 시간 중에는 인증할 수 없습니다.`);
      setShowPwInput(false);
      return;
    }

    if (tempPw === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      // ✅ 성공 시: 잠금 기록 초기화 및 이동
      resetAuthAttempts();
      setShowPwInput(false);
      setTempPw("");
      router.push("/admin/visitors");
    } else {
      // ❌ 실패 시: 횟수 기록 및 잠금 여부 확인
      const isLockedNow = recordFailAttempt();
      if (isLockedNow) {
        alert("비밀번호 5회 오류로 인해 1분간 접속이 제한됩니다.");
        setShowPwInput(false);
      } else {
        const attempts = localStorage.getItem("admin_pw_attempts");
        alert(`비밀번호가 일치하지 않습니다. (현재 ${attempts}/5회 오류)`);
      }
      setTempPw("");
    }
  };

  useEffect(() => {
    const handleVisit = async () => {
      try {
        // 1. 한국 시간 기준 날짜 설정
        const now = new Date()
        const kstNow = new Date(now.getTime() + (9 * 60 * 60 * 1000))
        const todayStr = kstNow.toISOString().split('T')[0]

        const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000) + (9 * 60 * 60 * 1000))
        const yesterdayStr = yesterday.toISOString().split('T')[0]

        /** 2. 오늘 방문자수 업데이트 (daily_visitors) */
        const isCounted = sessionStorage.getItem("kccn_visit_final")
        
        if (!isCounted) {
          const { data: todayRow } = await supabase
            .from("daily_visitors")
            .select("count")
            .eq("date", todayStr)
            .maybeSingle()

          if (!todayRow) {
            await supabase.from("daily_visitors").insert({ date: todayStr, count: 1 })
          } else {
            await supabase
              .from("daily_visitors")
              .update({ count: (todayRow.count || 0) + 1 })
              .eq("date", todayStr)
          }
          sessionStorage.setItem("kccn_visit_final", "true")
        }

        /** 3. 전일 방문자수 조회 (어제) */
        const { data: yesterdayRow } = await supabase
          .from("daily_visitors")
          .select("count")
          .eq("date", yesterdayStr)
          .maybeSingle()
        
        setYesterdayHits(yesterdayRow?.count ?? 0)

        /** 4. 누적 방문자수 합산 (가장 중요: 모든 날짜의 count를 합침) */
        const { data: allDailyData } = await supabase
          .from("daily_visitors")
          .select("count")

        if (allDailyData) {
          const totalSum = allDailyData.reduce((acc, cur) => acc + (cur.count || 0), 0)
          setTotalHits(totalSum)
        }

        /** 5. 링버퍼 상세 로그 기록 (추가된 부분) */
        // 현재 페이지 경로(window.location.pathname)를 넘겨 상세 정보를 기록합니다.
        logVisitorDetail(window.location.pathname);

      } catch (err) {
        console.error("방문자 집계 오류:", err)
      }
    }

    handleVisit()
  }, [])

  return (
    <>
      <div className="flex flex-row items-center justify-start gap-2 md:gap-5 mt-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs opacity-70 text-white font-sans">전체 방문자:</span>
          <span className="text-sm font-bold text-blue-400 font-sans">{totalHits.toLocaleString()}</span>
        </div>
        <div className="md:block w-[4px] h-3 bg-white/30"></div>
        {/* <div className="hidden md:block w-[1px] h-3 bg-white/20"></div> */}
        
        {/* 클릭 시 비밀번호 확인 후 상세 로그 페이지로 이동 */}
        <div 
          className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleAdminAccess}
        >
          <span className="text-xs opacity-70 text-white font-sans">전일 방문자:</span>
          <span className="text-sm font-bold text-emerald-400 font-sans">{yesterdayHits.toLocaleString()}</span>
          <span className="text-[10px] opacity-40 ml-0.5 text-white font-sans"> </span> {/* >명</span> */}
        </div>
      </div>

      {/* ▽ 비밀번호 입력 팝업 모달 (보안 로직 적용) ▽ */}
      {showPwInput && (
        <div className="fixed inset-0 z-[9999] flex items-start pt-40 justify-center bg-black/60 backdrop-blur-sm p-4">
          <form 
            onSubmit={confirmAccess} 
            className="bg-[#1a1a1a] border border-white/20 p-6 rounded-2xl shadow-2xl w-full max-w-[300px] animate-in fade-in zoom-in duration-200"
          >
            <h3 className="text-white text-sm font-bold mb-4 text-center">관리자 인증</h3>
            <input 
              type="password" 
              autoFocus
              placeholder="비밀번호 입력"
              value={tempPw}
              onChange={(e) => setTempPw(e.target.value)}
              className="w-full bg-white/10 text-white text-sm border border-white/20 rounded-lg px-3 py-2.5 mb-4 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => { setShowPwInput(false); setTempPw(""); }}
                className="flex-1 text-xs text-white/60 hover:text-white py-2 transition-colors"
              >
                취소
              </button>
              <button 
                type="submit" 
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded-lg transition-colors"
              >
                확인
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}