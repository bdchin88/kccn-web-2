import { createClient } from '@supabase/supabase-js';

// 1. Vercel 설정 무시하고 실제 작동하는 주소를 직접 입력합니다.
const supabaseUrl = 'https://shdpkyvgjnzwpxzcuqoc.supabase.co';

// 2. 키값도 실제 작동하는 MY_ 변수 혹은 하드코딩된 값을 최우선으로 합니다.
const supabaseAnonKey = 
  process.env.MY_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZHBreXZnam56d3B4emN1cW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA4ODIsImV4cCI6MjA4NDQ2Njg4Mn0.SByIotU6iLlZObNUcWRLzaZuWs54cNKR7voqzVf0nig';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);