// components/DownloadSection.tsx
"use client";

import { useState } from "react";
import { FileDown, Lock } from "lucide-react";

export default function DownloadSection({ filePath }: { filePath: string }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!password) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, filePath }),
      });

      const result = await response.json();

      if (response.ok && result.url) {
        window.location.href = result.url; // 다운로드 시작
      } else {
        alert(result.error || "비밀번호가 틀렸거나 오류가 발생했습니다.");
      }
    } catch (error) {
      alert("서버 통신 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 p-8 bg-slate-50 rounded-2xl border border-slate-100">
      <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold">
        <FileDown className="w-5 h-5 text-[#0047AB]" />
        <h3>첨부파일 다운로드</h3>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0047AB] transition-all"
          />
        </div>
        <button
          onClick={handleDownload}
          disabled={loading}
          className="px-6 py-3 bg-[#0047AB] text-white font-bold rounded-xl hover:bg-blue-700 disabled:bg-slate-400 transition-all flex items-center justify-center min-w-[120px]"
        >
          {loading ? "확인 중..." : "다운로드"}
        </button>
      </div>
      <p className="mt-3 text-xs text-slate-400">
        보안 문서입니다. 지정된 비밀번호를 입력해야 다운로드가 가능합니다.
      </p>
    </div>
  );
}