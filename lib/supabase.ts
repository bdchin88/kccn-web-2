import { createClient } from '@supabase/supabase-js';

// process.env를 쓰지 않고, 주소와 키를 '문자열'로 직접 박아버립니다.
// 이렇게 하면 Vercel 설정에 뭐가 있든 무시하고 이 주소로만 연결됩니다.
// 직접 박았던 문자열을 제거하고 환경 변수를 불러옵니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);