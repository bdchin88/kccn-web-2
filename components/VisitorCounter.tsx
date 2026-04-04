"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://shdpkyvgjnzwpxzcuqoc.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZHBreXZnam56d3B4emN1cW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA4ODIsImV4cCI6MjA4NDQ2Njg4Mn0.SByIotU6iLlZObNUcWRLzaZuWs54cNKR7voqzVf0nig"
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default function VisitorCounter() {
  const [totalHits, setTotalHits] = useState(0)
  const [yesterdayHits, setYesterdayHits] = useState(0)

  useEffect(() => {
    async function handleVisit() {
      // 1. 날짜 설정 (KST 기준)
      const now = new Date()
      const todayStr = new Date(now.getTime() + (9 * 60 * 60 * 1000)).toISOString().split('T')[0]

      const yesterday = new Date(now)
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = new Date(yesterday.getTime() + (9 * 60 * 60 * 1000)).toISOString().split('T')[0]

      /** 2. 일일 방문자 테이블 업데이트 (오늘) */
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
          .update({ count: todayRow.count + 1 })
          .eq("date", todayStr)
      }

      /** 3. 전일 방문자수 조회 (어제 데이터 보여주기) */
      const { data: yesterdayRow } = await supabase
        .from("daily_visitors")
        .select("count")
        .eq("date", yesterdayStr)
        .maybeSingle()
      
      setYesterdayHits(yesterdayRow?.count ?? 0)

      /** 4. 전체 누적 방문자수 처리 (visitor_stats 테이블) */
      // DB에서 현재 '진짜' 누적 숫자를 가져옵니다.
      const { data: cumulativeRow } = await supabase
        .from("visitor_stats")
        .select("count")
        .eq("id", 1)
        .maybeSingle()

      let finalTotal = cumulativeRow?.count ?? 0

      // 세션 체크: 브라우저가 열려있는 동안은 1번만 카운트
      const isCounted = sessionStorage.getItem("kccn_counted")
      
      if (!isCounted) {
        finalTotal += 1
        await supabase
          .from("visitor_stats")
          .update({ count: finalTotal })
          .eq("id", 1)
        
        sessionStorage.setItem("kccn_counted", "true")
      }

      // 최종적으로 누적 숫자를 상태에 저장
      setTotalHits(finalTotal)
    }

    handleVisit()
  }, [])

  return (
    <div className="mt-4 space-y-1 text-white">
      <p className="text-sm opacity-90">
        누적 방문자수: <span className=\"font-bold\">{totalHits.toLocaleString()}</span>명
        <span className="ml-4">
          전일 방문자수: <span className="font-bold">{yesterdayHits.toLocaleString()}</span>명
        </span>
      </p>
    </div>
  )
}