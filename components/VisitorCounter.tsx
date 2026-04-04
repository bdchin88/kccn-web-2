"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

// Supabase 설정 (기존 정보 유지)
const SUPABASE_URL = "https://shdpkyvgjnzwpxzcuqoc.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZHBreXZnam56d3B4emN1cW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA4ODIsImV4cCI6MjA4NDQ2Njg4Mn0.SByIotU6iLlZObNUcWRLzaZuWs54cNKR7voqzVf0nig"
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default function VisitorCounter() {
  const [totalHits, setTotalHits] = useState(0)
  const [yesterdayHits, setYesterdayHits] = useState(0)

  useEffect(() => {
    async function handleVisit() {
      /** 1️⃣ 날짜 계산 (오늘 및 어제) */
      const today = new Date()
      const yyyy = today.getFullYear()
      const mm = String(today.getMonth() + 1).padStart(2, "0")
      const dd = String(today.getDate()).padStart(2, "0")
      const todayStr = `${yyyy}-${mm}-${dd}`

      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const y_yyyy = yesterday.getFullYear()
      const y_mm = String(yesterday.getMonth() + 1).padStart(2, "0")
      const y_dd = String(yesterday.getDate()).padStart(2, "0")
      const yesterdayStr = `${y_yyyy}-${y_mm}-${y_dd}`

      /** 2️⃣ 일일 방문자수 처리 (오늘) */
      const { data: todayData } = await supabase
        .from("daily_visitors")
        .select("count")
        .eq("date", todayStr)
        .maybeSingle()

      if (!todayData) {
        // 오늘 첫 방문자라면 데이터 생성
        await supabase
          .from("daily_visitors")
          .insert({ date: todayStr, count: 1 })
      } else {
        // 이미 데이터가 있다면 카운트 +1
        await supabase
          .from("daily_visitors")
          .update({ count: todayData.count + 1 })
          .eq("date", todayStr)
      }

      /** 3️⃣ 전일 방문자수 조회 (어제) */
      const { data: yesterdayData } = await supabase
        .from("daily_visitors")
        .select("count")
        .eq("date", yesterdayStr)
        .maybeSingle()

      setYesterdayHits(yesterdayData?.count ?? 0)

      /** 4️⃣ 누적 방문자수 처리 (visitor_stats) */
      // DB에서 현재 누적값 가져오기
      const { data: statsData } = await supabase
        .from("visitor_stats")
        .select("count")
        .eq("id", 1)
        .maybeSingle()

      let currentTotal = statsData?.count ?? 0

      // 세션 체크를 통해 중복 카운트 방지
      const hasVisited = sessionStorage.getItem("visited_today")
      if (!hasVisited) {
        currentTotal += 1
        await supabase
          .from("visitor_stats")
          .update({ count: currentTotal })
          .eq("id", 1)

        sessionStorage.setItem("visited_today", "true")
      }

      // 최종 누적 숫자를 화면에 반영 (재방문자도 최신값을 볼 수 있게 if문 밖에서 실행)
      setTotalHits(currentTotal)
    }

    handleVisit()
  }, [])

  return (
    <div className="mt-4 space-y-1">
      <p className="text-sm opacity-90">
        누적 방문자수: <span className="font-bold">{totalHits.toLocaleString()}</span>명
        <span className="ml-4">
          전일 방문자수: <span className="font-bold">{yesterdayHits.toLocaleString()}</span>명
        </span>
      </p>
    </div>
  )
}