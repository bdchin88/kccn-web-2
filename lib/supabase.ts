import { createClient } from '@supabase/supabase-js';

// Vercel에서 새로 등록할 환경 변수 이름을 사용합니다.
// (기존 NEXT_PUBLIC_... 은 Vercel 연동 때문에 수정이 안 되므로 이름을 바꿉니다.)
const supabaseUrl = process.env.MY_SUPABASE_URL;
const supabaseAnonKey = process.env.MY_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("환경 변수가 설정되지 않았습니다. Vercel Settings를 확인하세요.");
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);