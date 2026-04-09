"use client"

import React, { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://shdpkyvgjnzwpxzcuqoc.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZHBreXZnam56d3B4emN1cW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA4ODIsImV4cCI6MjA4NDQ2Njg4Mn0.SByIotU6iLlZObNUcWRLzaZuWs54cNKR7voqzVf0nig"
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default function VisitorCounter() {
  const [totalHits, setTotalHits] = useState<number>(0)
  const [yesterdayHits, setYesterdayHits] = useState<number>(0)

  useEffect(() => {
    const handleVisit = async () => {
      try {
        // 1. 날짜 설정 (한국 시간 기준)
        const now = new Date()
        const kstNow = new Date(now.getTime() + (9 * 60 * 60 * 1000))
        const todayStr = kstNow.toISOString().split('T')[0]

        const yesterday = new Date(now)
        yesterday.setDate(yesterday.getDate() - 1)
        const kstYesterday = new Date(yesterday.getTime() + (9 * 60 * 60 * 1000))
        const yesterdayStr = kstYesterday.toISOString().split('T')[0]

        /** 2. 일일 방문자수 (오늘) 업데이트 */
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

        /** 3. 전일 방문자수 (어제) 조회 */
        const { data: yesterdayRow } = await supabase
          .from("daily_visitors")
          .select("count")
          .eq("date", yesterdayStr)
          .maybeSingle()
        
        if (yesterdayRow) {
          setYesterdayHits(yesterdayRow.count)
        }

        /** 4. 누적 방문자수 처리 (visitor_stats 테이블) */
        // DB에서 실제 누적 기록을 가져옴
        const { data: statsRow } = await supabase
          .from("visitor_stats")
          .select("count")
          .eq("id", 1)
          .maybeSingle()

        let realTotal = statsRow?.count ?? 0

        // 세션 체크로 중복 카운트 방지
        const isAlreadyCounted = sessionStorage.getItem("kccn_total_counted")
        
        if (!isAlreadyCounted) {
          realTotal += 1
          await supabase
            .from("visitor_stats")
            .update({ count: realTotal })
            .eq("id", 1)
          
          sessionStorage.setItem("kccn_total_counted", "true")
        }

        // 최종 누적값을 상태에 반영
        setTotalHits(realTotal)

      } catch (err) {
        console.error("Visitor Counter Error:", err)
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