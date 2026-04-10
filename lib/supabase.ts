// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Vercel 설정보다 이 코드가 우선하도록 주소를 직접 입력합니다.
const supabaseUrl = 'https://shdpkyvgjnzwpxzcuqoc.supabase.co';
const supabaseAnonKey = 
  process.env.MY_SUPABASE_ANON_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZHBreXZnam56d3B4emN1cW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA4ODIsImV4cCI6MjA4NDQ2Njg4Mn0.SByIotU6iLlZObNUcWRLzaZuWs54cNKR7voqzVf0nig';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);