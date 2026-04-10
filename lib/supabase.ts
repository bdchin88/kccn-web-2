import { createClient } from '@supabase/supabase-js';

// Vercel 설정을 완전히 무시하도록 변수를 거치지 않고 직접 주소를 넣습니다.
const supabaseUrl = 'https://shdpkyvgjnzwpxzcuqoc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZHBreXZnam56d3B4emN1cW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA4ODIsImV4cCI6MjA4NDQ2Njg4Mn0.SByIotU6iLlZObNUcWRLzaZuWs54cNKR7voqzVf0nig';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);