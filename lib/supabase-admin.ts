import "server-only"; // ◀ 서버 환경에서만 불러올 수 있도록 정적 검증 추가
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);