import { createClient } from '@supabase/supabase-js';

// Vercel 환경 변수가 개입하지 못하도록 주소와 키를 직접 변수에 할당합니다.
const supabaseUrl = 'https://shdpkyvgjnzwpxzcuqoc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZHBreXZnam56d3B4emN1cW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA4ODIsImV4cCI6MjA4NDQ2Njg4Mn0.SByIotU6iLlZObNUcWRLzaZuWs54cNKR7voqzVf0nig';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);