"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

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

  // 1. 관리자 인증 (환경변수에 저장된 DOWNLOAD_PASSWORD 재활용)
  const handleAuth = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) { // Vercel에 설정 필요
      setIsAuthorized(true);
    } else {
      alert("비밀번호가 틀립니다.");
    }
  };

  // 2. 파일 업로드 및 게시글 등록 로직
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let filePath = "";
      let hasFile = false;

      // 파일이 있을 경우 Storage 업로드
      if (file) {
        // 영문 파일명만 허용 (정규식 체크)
        const fileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("resources")
          .upload(`public/${Date.now()}_${fileName}`, file);

        if (uploadError) throw uploadError;
        filePath = uploadData.path;
        hasFile = true;
      }

      // DB Insert
      const { error: dbError } = await supabase.from("posts").insert({
        title,
        content,
        type,
        location,
        expiry_date: expiryDate || null,
        file_path: filePath,
        has_file: hasFile,
        is_published: true,
      });

      if (dbError) throw dbError;

      alert("게시글이 성공적으로 등록되었습니다.");
      router.push("/notice");
    } catch (error: any) {
      alert("등록 실패: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
          <h1 className="text-xl font-bold mb-4 text-center">등록 관리자 인증</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 outline-none focus:ring-2 focus:ring-[#0047AB]"
            placeholder="비밀번호 입력"
          />
          <button
            onClick={handleAuth}
            className="w-full bg-[#0047AB] text-white py-3 rounded-lg font-bold"
          >
            접속하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-extrabold mb-8 text-slate-900">게시글 작성</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        {/* 타입 선택 */}
        <div>
          <label className="block text-sm font-bold mb-2">카테고리</label>
          <div className="flex gap-4">
            {["notice", "issue", "archive"].map((t) => (
              <label key={t} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value={t}
                  checked={type === t}
                  onChange={(e) => setType(e.target.value)}
                  className="w-4 h-4 accent-[#0047AB]"
                />
                <span className="capitalize">{t === "notice" ? "공지사항" : t === "issue" ? "이슈/정보" : "자료실"}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 제목 */}
        <div>
          <label className="block text-sm font-bold mb-2">제목</label>
          <input
            required
            className="w-full p-3 border rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* 내용 */}
        <div>
          <label className="block text-sm font-bold mb-2">
            내용 {type === "archive" && <span className="text-blue-500 text-xs">(자료실은 요약문만 권장)</span>}
          </label>
          <textarea
            required
            rows={10}
            className="w-full p-3 border rounded-lg"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* 장소/시간 (선택) */}
        <div>
          <label className="block text-sm font-bold mb-2">장소 및 시간 (선택)</label>
          <input
            className="w-full p-3 border rounded-lg"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="예: 협회 대회의실, 14:00"
          />
        </div>

        {/* 공지 종료일 (Notice 전용) */}
        {type === "notice" && (
          <div>
            <label className="block text-sm font-bold mb-2">메인 게시 종료일 (선택)</label>
            <input
              type="datetime-local"
              className="w-full p-3 border rounded-lg"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
        )}

        {/* 파일 업로드 */}
        {type === "archive" && (
          <div>
            <label className="block text-sm font-bold mb-2">첨부파일 (영문파일명 권장)</label>
            <input
              type="file"
              className="w-full p-2 border border-dashed rounded-lg"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-xl text-white font-bold transition-all ${
            loading ? "bg-gray-400" : "bg-[#0047AB] hover:bg-blue-800"
          }`}
        >
          {loading ? "등록 중..." : "게시글 등록하기"}
        </button>
      </form>
    </div>
  );
}