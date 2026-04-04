"use client"
// id:bdchin88@gmail.com, pw:Kccn3447**, kccn107
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://shdpkyvgjnzwpxzcuqoc.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZHBreXZnam56d3B4emN1cW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA4ODIsImV4cCI6MjA4NDQ2Njg4Mn0.SByIotU6iLlZObNUcWRLzaZuWs54cNKR7voqzVf0nig"
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default function VisitorCounter() {
  const [totalHits, setTotalHits] = useState<number>(0)
  const [yesterdayHits, setYesterdayHits] = useState<number>(0)

  useEffect(() => {
    async function handleVisit() {
      // 1. 날짜 계산 (오늘 및 어제)
      const now = new Date()
      const formatDate = (d: Date) => {
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, "0")
        const date = String(d.getDate()).padStart(2, "0")
        return `${y}-${m}-${date}`
      }

      const todayStr = formatDate(now) // [cite: 2]
      const yesterday = new Date(now)
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = formatDate(yesterday) // [cite: 2]

      // 2. 전일 방문자 데이터 조회
      // 수정 제안 (에러 확인용 로그 추가)
      const { data: yesterdayData, error: yError } = await supabase
        .from("daily_visitors")
        .select("count")
        .eq("date", yesterdayStr)
        .maybeSingle(); // single() 대신 maybeSingle()을 쓰면 데이터가 없을 때 에러를 뿜지 않습니다.

      if (yError) console.error("어제 데이터 조회 실패:", yError);
      setYesterdayHits(yesterdayData?.count ?? 0) // [cite: 5]

      // 3. 중복 방문 방지 체크 (세션 기준)
      const hasVisited = sessionStorage.getItem("visited_today")

      if (!hasVisited) {
        // [오늘 방문자수 업데이트/생성]
        const { data: todayData } = await supabase
          .from("daily_visitors")
          .select("count")
          .eq("date", todayStr)
          .single() // [cite: 3]

        if (!todayData) {
          await supabase.from("daily_visitors").insert({ date: todayStr, count: 1 }) // [cite: 3]
        } else {
          await supabase
            .from("daily_visitors")
            .update({ count: todayData.count + 1 })
            .eq("date", todayStr) // [cite: 4]
        }

        // [전체 누적 방문자수 업데���트]
        const { data: statsData } = await supabase
          .from("visitor_stats")
          .select("count")
          .eq("id", 1)
          .single() // [cite: 5]

        let nextCount = (statsData?.count ?? 0) + 1 // [cite: 6]

        await supabase
          .from("visitor_stats")
          .update({ count: nextCount })
          .eq("id", 1) // [cite: 6]

        setTotalHits(nextCount)
        sessionStorage.setItem("visited_today", "true") // [cite: 6]
      } else {
        // 이미 방문한 세션은 조회만 수행
        const { data: statsData } = await supabase
          .from("visitor_stats")
          .select("count")
          .eq("id", 1)
          .single()
        setTotalHits(statsData?.count ?? 0)
      }
    }

    handleVisit()
  }, [])

  return (
    <p className="text-sm opacity-90">
      누적 방문자수: {totalHits.toLocaleString()}명
      <span className="ml-2">
        (전일 {yesterdayHits.toLocaleString()}명)
      </span>
    </p>
  )
}
