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
      /** 🔹 날짜 계산 */
      const today = new Date()
      const yyyy = today.getFullYear()
      const mm = String(today.getMonth() + 1).padStart(2, "0")
      const dd = String(today.getDate()).padStart(2, "0")
      const todayStr = `${yyyy}-${mm}-${dd}`

      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yyyyy = yesterday.getFullYear()
      const ymm = String(yesterday.getMonth() + 1).padStart(2, "0")
      const ydd = String(yesterday.getDate()).padStart(2, "0")
      const yesterdayStr = `${yyyyy}-${ymm}-${ydd}`

      /** 🔹 오늘 방문자 처리 */
      const { data: todayData } = await supabase
        .from("daily_visitors")
        .select("count")
        .eq("date", todayStr)
        .maybeSingle() // 데이터가 없어도 다음 줄(if (!todayData))로 넘어감

      if (!todayData) {
        await supabase
          .from("daily_visitors")
          .insert({ date: todayStr, count: 1 })
      } else {
        await supabase
          .from("daily_visitors")
          .update({ count: todayData.count + 1 })
          .eq("date", todayStr)
      }

      /** 🔹 전일 방문자 조회 */
      const { data: yesterdayData } = await supabase
        .from("daily_visitors")
        .select("count")
        .eq("date", yesterdayStr)
        .maybeSingle() // 데이터가 없어도 다음 줄(if (!todayData))로 넘어감

      setYesterdayHits(yesterdayData?.count ?? 0)

      /** 🔹 누적 방문자 */
      const { data } = await supabase
        .from("visitor_stats")
        .select("count")
        .eq("id", 1)
        .maybeSingle() // 데이터가 없어도 다음 줄(if (!todayData))로 넘어감

      let currentCount = data?.count ?? 0

      const hasVisited = sessionStorage.getItem("visited_today")
      if (!hasVisited) {
        currentCount += 1
        await supabase
          .from("visitor_stats")
          .update({ count: currentCount })
          .eq("id", 1)

        sessionStorage.setItem("visited_today", "true")
      }

      setTotalHits(currentCount)
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

