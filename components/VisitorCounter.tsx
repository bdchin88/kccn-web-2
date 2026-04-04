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
      // 1. 날짜 설정
      const today = new Date()
      const todayStr = today.toISOString().split('T')[0] // YYYY-MM-DD

      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      /** 2. 오늘 일일 방문자 카운트 (DB 업데이트) */
      const { data: todayData } = await supabase
        .from("daily_visitors")
        .select("count")
        .eq("date", todayStr)
        .maybeSingle()

      if (!todayData) {
        await supabase.from("daily_visitors").insert({ date: todayStr, count: 1 })
      } else {
        await supabase
          .from("daily_visitors")
          .update({ count: todayData.count + 1 })
          .eq("date", todayStr)
      }

      /** 3. 전일(어제) 방문자수 조회 (화면 표시용) */
      const { data: yData } = await supabase
        .from("daily_visitors")
        .select("count")
        .eq("date", yesterdayStr)
        .maybeSingle()
      
      setYesterdayHits(yData?.count ?? 0)

      /** 4. 전체 누적 방문자수 처리 (가장 중요) */
      // DB에서 현재 진짜 누적값(예: 785)을 가져옵니다.
      const { data: statsData } = await supabase
        .from("visitor_stats")
        .select("count")
        .eq("id", 1)
        .maybeSingle()

      let dbTotalCount = statsData?.count ?? 0

      // 세션 체크: 브라우저를 완전히 껐다 켜기 전까지는 카운트를 올리지 않음
      const hasVisited = sessionStorage.getItem("visited_kccn")
      
      if (!hasVisited) {
        // 처음 방문했다면 DB에 +1 해서 저장
        dbTotalCount += 1
        await supabase
          .from("visitor_stats")
          .update({ count: dbTotalCount })
          .eq("id", 1)
        
        sessionStorage.setItem("visited_kccn", "true")
      }

      // 화면에는 DB에서 가져온(혹은 업데이트된) 전체 누적 숫자를 보여줌
      setTotalHits(dbTotalCount)
    }

    handleVisit()
  }, [])

  return (
    <div className="mt-4 space-y-1">
      <p className="text-sm opacity-90">
        누적 방문자수: <span className="font-bold text-blue-400">{totalHits.toLocaleString()}</span>명
        <span className="ml-4">
          전일 방문자수: <span className="font-bold">{yesterdayHits.toLocaleString()}</span>명
        </span>
      </p>
    </div>
  )
}