// lib/visitor.ts
import { supabase } from "./supabase";

export const logVisitorDetail = async (pagePath: string) => {
{/*
  // 🛡️ [임시 RLS 테스트] DELETE 차단 여부 확인
  supabase.from("visitor_pointer").delete().eq("id", 1).then(({ error }) => {
    console.log("🛡️ RLS 보안 테스트:", error ? "✅ DELETE 차단 성공! (안전)" : "❌ 삭제됨 (보안 점검 필요)");
  });
*/}  

  try {
    // 1. 현재 포인터 가져오기
    const { data: pointer, error: pointerError } = await supabase
      .from("visitor_pointer")
      .select("current_idx")
      .single();

    if (pointerError || !pointer) {
      console.warn("⚠️ [Visitor Log] 포인터를 가져오지 못했습니다:", pointerError?.message);
      return;
    }

    const idx = pointer.current_idx;

    // 2. 방문자 정보 수집
    // (참고: 클라이언트 사이드에서 IP는 외부 API를 통해 가져와야 정확합니다)
    let ip = "0.0.0.0";
    try {
      const ipRes = await fetch("https://api64.ipify.org?format=json");
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        ip = ipData.ip || "0.0.0.0";
      }
    } catch (ipErr) {
      console.warn("⚠️ [Visitor Log] IP 수집 실패 (기본값으로 계속 진행):", ipErr);
    }

    // 📌 [신규 추가] 특정 IP 수집 제외 로직
    // const excludedIPs = ["49.254.178.83", "49.254.178.84"];
    const excludedIPs = ["49.254.178.83"];
    if (excludedIPs.includes(ip)) {
      // 제외된 IP일 경우 로그를 남기지 않고 여기서 중단합니다.
      return;
    }

    const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
    const referrer = typeof document !== "undefined" && document.referrer ? document.referrer : "직접 유입";

    // 3. 링버퍼 해당 슬롯에 덮어쓰기
    const { error: updateError } = await supabase
      .from("yesterday_visitor_logs")
      .update({
        ip: ip,
        device: userAgent.includes("Mobi") ? "Mobile" : "Desktop",
        referrer: referrer,
        region: Intl.DateTimeFormat().resolvedOptions().timeZone, // 시간대 기준 지역
        page_path: pagePath,
        created_at: new Date().toISOString()
      })
      .eq("id", idx); // idx가 70까지 들어오게 됩니다.

    if (updateError) {
      console.error(`❌ [Visitor Log] Slot ${idx} 덮어쓰기 실패:`, updateError.message);
      return; // 슬롯 업데이트 실패 시 포인터를 전진시키지 않고 중단
    }

    // 4. 다음 포인터 계산 (70 넘으면 1로 리셋)
    const nextIdx = idx >= 70 ? 1 : idx + 1;

    // 5. 포인터 업데이트
    const { error: pointerUpdateError } = await supabase
      .from("visitor_pointer")
      .update({ current_idx: nextIdx })
      .eq("id", 1);

    if (pointerUpdateError) {
      console.error("❌ [Visitor Log] 포인터 업데이트 실패:", pointerUpdateError.message);
    } else {
      console.log(`✅ [Visitor Log] Slot ${idx} 기록 완료 (다음 포인터: ${nextIdx})`);
    }

  } catch (err) {
    console.error("방문자 상세 로그 기록 오류:", err);
  }
};