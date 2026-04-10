import { createClient } from '@supabase/supabase-js';

// process.env를 쓰지 않고, 주소와 키를 '문자열'로 직접 박아버립니다.
// 이렇게 하면 Vercel 설정에 뭐가 있든 무시하고 이 주소로만 연결됩니다.
const supabaseUrl = 'https://shdpkyvgjnzwpxzcuqoc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZHBreXZnam56d3B4emN1cW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA4ODIsImV4cCI6MjA4NDQ2Njg4Mn0.SByIotU6iLlZObNUcWRLzaZuWs54cNKR7voqzVf0nig';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);