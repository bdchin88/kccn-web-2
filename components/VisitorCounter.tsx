"use client"

import React, { useEffect, useState } from "react"
//import { createClient } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"; // 이미 생성된 클라이언트를 재사용

export default function VisitorCounter() {
  const [totalHits, setTotalHits] = useState<number>(0)
  const [yesterdayHits, setYesterdayHits] = useState<number>(0)

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

      } catch (err) {
        console.error("방문자 집계 오류:", err)
      }
    }

    handleVisit()
  }, [])

  return (
    <div className="mt-4 space-y-1 text-white">
      <p className="text-sm opacity-90">
        누적 방문자수: <span className="font-bold">{totalHits.toLocaleString()}</span>명
        <span className="ml-4">
          전일 방문자수: <span className="font-bold">{yesterdayHits.toLocaleString()}</span>명
        </span>
      </p>
    </div>
  )
}