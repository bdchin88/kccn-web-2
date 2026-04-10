import { createClient } from '@supabase/supabase-js';

// 1. 서버와 브라우저 모두에서 읽을 수 있도록 접두사가 붙은 것과 붙지 않은 것을 모두 체크합니다.
const supabaseUrl = 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.MY_SUPABASE_URL || 
  'https://shdpkyvgjnzwpxzcuqoc.supabase.co';

const supabaseAnonKey = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.MY_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZHBreXZnam56d3B4emN1cW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA4ODIsImV4cCI6MjA4NDQ2Njg4Mn0.SByIotU6iLlZObNUcWRLzaZuWs54cNKR7voqzVf0nig';

// 2. 클라이언트 환경에서도 안전하게 초기화되도록 내보냅니다.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);