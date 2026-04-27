"use client";

import { supabase } from "@/lib/supabase";
import { checkAdminLock, recordFailAttempt, resetAuthAttempts } from "@/lib/auth";

export default function DownloadSection({ filePath }: { filePath: string }) {
  const handleDownload = async () => {
    // 1. 잠금 상태 체크
    const lockStatus = checkAdminLock();
    if (lockStatus.isLocked) {
      alert(`보안 제한 상태입니다. ${lockStatus.remaining}초 후 다시 시도하세요.`);
      return;
    }

    const pw = prompt("파일 다운로드를 위해 비밀번호를 입력하세요.");
    if (!pw) return;

    // 2. 비밀번호 확인
    if (pw === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      resetAuthAttempts(); // 성공 시 초기화
      
      const { data, error } = await supabase.storage
        .from("archives")
        .createSignedUrl(filePath, 60);

      if (error) {
        alert("다운로드 링크를 생성하는 중 오류가 발생했습니다.");
        return;
      }
      window.location.href = data.signedUrl;
    } else {
      // 3. 실패 시 횟수 기록 및 잠금 처리
      const isLockedNow = recordFailAttempt();
      if (isLockedNow) {
        alert("비밀번호 5회 오류로 1분간 다운로드가 제한됩니다.");
      } else {
        const attempts = localStorage.getItem("admin_pw_attempts");
        alert(`비밀번호가 틀립니다. (현재 ${attempts}/5회 오류)`);
      }
    }
  };

  return (
    <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-bold text-slate-900 mb-1">첨부파일이 있습니다.</p>
        <p className="text-xs text-slate-500">안전한 다운로드를 위해 관리자 인증이 필요합니다.</p>
      </div>
      <button
        onClick={handleDownload}
        className="bg-white text-[#0047AB] border border-blue-200 px-6 py-2.5 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-sm"
      >
        파일 다운로드
      </button>
    </div>
  );
}