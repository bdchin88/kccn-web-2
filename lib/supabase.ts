// @/lib/supabase.ts
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://shdpkyvgjnzwpxzcuqoc.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZHBreXZnam56d3B4emN1cW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA4ODIsImV4cCI6MjA4NDQ2Njg4Mn0.SByIotU6iLlZObNUcWRLzaZuWs54cNKR7voqzVf0nig'

// 환경 변수 누락 시 경고 (개발 단계 확인용)
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase 환경 변수가 설정되지 않았습니다. Vercel Settings를 확인하세요.");
}

// 1. 기존 함수 유지 (필요한 경우)
export const createClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// 2. 싱글톤 객체 내보내기 (가장 많이 사용됨)
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)