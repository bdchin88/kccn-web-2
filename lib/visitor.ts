// lib/visitor.ts
import { supabase } from "./supabase";

export const logVisitorDetail = async (pagePath: string) => {
  try {
    // 1. 현재 포인터 가져오기
    const { data: pointer } = await supabase.from("visitor_pointer").select("current_idx").single();
    if (!pointer) return;

    const idx = pointer.current_idx;

    // 2. 방문자 정보 수집
    // (참고: 클라이언트 사이드에서 IP는 외부 API를 통해 가져와야 정확합니다)
    const ipRes = await fetch("https://api64.ipify.org?format=json");
    const { ip } = await ipRes.json();
    
    // 📌 [신규 추가] 특정 IP 수집 제외 로직
    const excludedIPs = ["49.254.178.83", "49.254.178.84"];
    if (excludedIPs.includes(ip)) {
      // 제외된 IP일 경우 로그를 남기지 않고 여기서 중단합니다.
      return;
    }
    
    const userAgent = navigator.userAgent;
    const referrer = document.referrer || "직접 유입";
    
    // 3. 링버퍼 해당 슬롯에 덮어쓰기
    await supabase.from("yesterday_visitor_logs").update({
      ip: ip,
      device: userAgent.includes("Mobi") ? "Mobile" : "Desktop",
      referrer: referrer,
      region: Intl.DateTimeFormat().resolvedOptions().timeZone, // 시간대 기준 지역
      page_path: pagePath,
      created_at: new Date().toISOString()
    }).eq("id", idx);

    // 4. 다음 포인터 계산 (50 넘으면 1로 리셋)
    const nextIdx = idx >= 50 ? 1 : idx + 1;

    // 5. 포인터 업데이트
    await supabase.from("visitor_pointer").update({ current_idx: nextIdx }).eq("id", 1);

  } catch (err) {
    console.error("방문자 상세 로그 기록 오류:", err)
  }
}