// app/admin/write/page.tsx 
"use client"; 

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { checkAdminLock, recordFailAttempt, resetAuthAttempts } from "@/lib/auth"; // ◀ 보안 공통 함수 추가

export default function AdminWritePage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  
  // 폼 상태 관리
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("notice");
  const [location, setLocation] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. 관리자 인증 (보안 로직 적용)
  const handleAuth = () => {
    // 📌 [보안 추가] 잠금 상태인지 먼저 확인
    const lockStatus = checkAdminLock();
    if (lockStatus.isLocked) {
      alert(`보안상 이유로 인증이 제한되었습니다. ${lockStatus.remaining}초 후 다시 시도하세요.`);
      return;
    }

    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      // ✅ 성공 시: 잠금 기록 초기화 및 권한 부여
      resetAuthAttempts();
      setIsAuthorized(true);
    } else {
      // ❌ 실패 시: 횟수 기록 및 잠금 여부 확인
      const isLockedNow = recordFailAttempt();
      if (isLockedNow) {
        alert("비밀번호 5회 오류로 인해 1분간 인증 시도가 제한됩니다.");
      } else {
        const attempts = localStorage.getItem("admin_pw_attempts");
        alert(`비밀번호가 틀립니다. (현재 ${attempts}/5회 오류)`);
      }
      setPassword(""); // 입력창 비우기
    }
  };

  // 2. 파일 업로드 및 게시글 등록 로직
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let filePath = "";
      let hasFile = false;

      // 파일이 있을 경우 Storage 업로드 (이하 기존 로직 유지)
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("archives")
          .upload(fileName, file);

        if (uploadError) throw uploadError;
        filePath = uploadData.path;
        hasFile = true;
      }

      const { error } = await supabase.from("posts").insert({
        title,
        content,
        type,
        location,
        expiry_date: expiryDate || null,
        file_path: filePath,
        has_file: hasFile,
      });

      if (error) throw error;

      alert("게시글이 성공적으로 등록되었습니다.");
      router.push("/notice");
    } catch (error: any) {
      alert("등록 중 오류가 발생했습니다: " + error.message);
    } finally {
      setLoading(false);
    }
  };

      {/* <div className="flex flex-col items-center justify-center에서 justify-center 삭제 py-20 추가 */}
  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center pt-40 min-h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-slate-900">관리자 인증</h1>
          <input
            type="password"
            className="w-full p-4 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAuth()} // 엔터키 지원
          />
          <button
            onClick={handleAuth}
            className="w-full bg-[#0047AB] text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
          >
            인증하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-10 text-slate-900 border-b pb-4">새 게시글 등록</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 기존 입력 폼 영역 (기본 구조 유지) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-slate-700">게시판 구분</label>
            <select
              className="w-full p-3 border rounded-lg bg-white"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="notice">공지사항</option>
              <option value="issue">이슈와 정보</option>
              <option value="archive">자료실</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2 text-slate-700">제목</label>
            <input
              required
              className="w-full p-3 border rounded-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="게시글 제목을 입력하세요"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2 text-slate-700">내용</label>
          <textarea
            required
            rows={12}
            className="w-full p-4 border rounded-lg resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {type === "notice" && (
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-700">장소 및 일시 (선택)</label>
              <input
                className="w-full p-3 border rounded-lg"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="예: 협회 대회의실, 2026년5월1일, 14:00"
              />
            </div>
          )}  

          {/* 공지 종료일 (Notice 전용) */}
          {type === "notice" && (
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-700">메인 게시 종료일 (선택)</label>
              <input
                type="datetime-local"
                className="w-full p-3 border rounded-lg"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* 파일 업로드 (Archive 전용) */}
        {type === "archive" && (
          <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <label className="block text-sm font-bold mb-3 text-slate-700">첨부파일 (영문파일명 권장)</label>
            <input
              type="file"
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
        )}

        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-white border border-slate-200 text-slate-600 p-4 rounded-xl font-bold hover:bg-slate-50 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-2 bg-[#0047AB] text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg disabled:bg-slate-400"
          >
            {loading ? "등록 중..." : "게시글 등록하기"}
          </button>
        </div>
      </form>
    </div>
  );
}