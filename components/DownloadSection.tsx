// components/DownloadSection.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { checkAdminLock, recordFailAttempt, resetAuthAttempts } from "@/lib/auth"; // 1분 잠금

export default function DownloadSection({ filePath }: { filePath: string }) {
  const [showPwInput, setShowPwInput] = useState(false);
  const [tempPw, setTempPw] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. 잠금 상태 체크
    const lockStatus = checkAdminLock();
    if (lockStatus.isLocked) {
      alert(`보안 제한 상태입니다. ${lockStatus.remaining}초 후 다시 시도하세요.`);
      return;
    }

    setLoading(true);

    {/* if (tempPw === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) DOWNLOAD_PASSWORD */}
    // 2. 비밀번호 확인 (환경변수와 비교)
    if (tempPw === process.env.NEXT_PUBLIC_DOWNLOAD_PASSWORD) {
      resetAuthAttempts(); // 성공 시 초기화
      
      const cleanPath = filePath.trim().startsWith('/') ? filePath.trim().substring(1) : filePath.trim();

      // 💡 앞서 성공하셨던 버킷 이름(resources)을 적용했습니다.
      const { data, error } = await supabase.storage
        .from("resources") 
        .createSignedUrl(cleanPath, 60);

      if (error) {
        console.error("Storage Error:", error);
        alert(`다운로드 실패: 파일을 찾을 수 없습니다.`);
        setLoading(false);
        return;
      }

      if (data?.signedUrl) {
        setShowPwInput(false);
        setTempPw("");
        window.location.href = data.signedUrl;
      }
    } else {
      // 3. 실패 시 횟수 기록 및 잠금 처리
      const isLockedNow = recordFailAttempt();
      if (isLockedNow) {
        alert("비밀번호 5회 오류로 1분간 다운로드가 제한됩니다.");
        setShowPwInput(false);
      } else {
        const attempts = localStorage.getItem("admin_pw_attempts");
        alert(`비밀번호가 틀립니다. (현재 ${attempts}/5회 오류)`);
      }
    }
    setLoading(false);
  };

  return (
    <>
      <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group transition-all hover:bg-slate-100/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-2xl">
            📁
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">첨부파일 자료</p>
            <p className="text-xs text-slate-500 truncate max-w-[200px] md:max-w-md">
              {filePath.split('/').pop()}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowPwInput(true)}
          className="px-6 py-2.5 bg-white text-[#0047AB] border border-slate-200 rounded-xl font-bold text-sm hover:bg-[#0047AB] hover:text-white transition-all shadow-sm active:scale-95"
        >
          파일 다운로드
        </button>
      </div>

      {/* 🔐 비밀번호 입력 모달 (비밀번호 숨김 처리 적용) */}
      {showPwInput && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form 
            onSubmit={handleDownload} 
            className="bg-white border border-slate-200 p-8 rounded-3xl shadow-2xl w-full max-w-[340px] animate-in fade-in zoom-in duration-200"
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-blue-50 text-[#0047AB] rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl">
                🔒
              </div>
              <h3 className="text-slate-900 text-lg font-bold">보안 인증</h3>
              <p className="text-slate-500 text-xs mt-1">파일 다운로드를 위해 비밀번호를 입력하세요.</p>
            </div>

            <input 
              type="password"  // ◀ 핵심: 비번이 **** 로 보임
              autoFocus
              placeholder="비밀번호 입력"
              value={tempPw}
              onChange={(e) => setTempPw(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-sm border border-slate-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-[#0047AB] focus:ring-2 focus:ring-blue-100 transition-all text-center"
            />

            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => { setShowPwInput(false); setTempPw(""); }}
                className="flex-1 text-sm text-slate-400 font-bold py-3 hover:text-slate-600 transition-colors"
              >
                취소
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-[#0047AB] text-white text-sm font-bold py-3 rounded-xl hover:bg-blue-700 shadow-md active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? "확인 중..." : "인증하기"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}