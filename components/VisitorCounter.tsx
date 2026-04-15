"use client"

import React, { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { logVisitorDetail } from "@/lib/visitor"; // ◀ 로그 수집 함수 임포트

export default function VisitorCounter() {
  const [totalHits, setTotalHits] = useState<number>(0)
  const [yesterdayHits, setYesterdayHits] = useState<number>(0)
  const router = useRouter();

  // 전일 방문자수 클릭 시 관리자 인증 후 이동
  const handleAdminAccess = () => {
    const pw = prompt("관리자 비밀번호를 입력하세요.");
    if (pw === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      router.push("/admin/visitors");
    } else {
      alert("비밀번호가 일치하지 않습니다.");
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

        /** 2. 오늘 방문자수 업데이트 (세션당 1회) */
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

        /** 3. 전일 방문자수 조회 */
        const { data: yesterdayRow } = await supabase
          .from("daily_visitors")
          .select("count")
          .eq("date", yesterdayStr)
          .maybeSingle()
        
        setYesterdayHits(yesterdayRow?.count ?? 0)

        /** 4. 누적 방문자수 합산 */
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
    <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-4 mt-2">
      <div className="flex items-center gap-1.5">
        <span className="text-xs opacity-70 text-white">전체 방문자:</span>
        <span className="text-sm font-bold text-blue-400">{totalHits.toLocaleString()}</span>
      </div>
      <div className="hidden md:block w-[1px] h-3 bg-white/20"></div>
      
      {/* 클릭 시 비밀번호 확인 후 상세 로그 페이지로 이동 */}
      <div 
        className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleAdminAccess}
      >
        <span className="text-xs opacity-70 text-white">전일 방문자수:</span>
        <span className="text-sm font-bold text-emerald-400">{yesterdayHits.toLocaleString()}</span>

      </div>
    </div>
  )
}
//        <span className="text-[10px] opacity-40 ml-0.5 text-white">명</span>
