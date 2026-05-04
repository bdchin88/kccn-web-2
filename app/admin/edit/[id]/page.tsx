// app/admin/edit/[id]/page.tsx 
"use client";

import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("notice");
  // 💡 추가된 필드 상태 관리
  const [location, setLocation] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [filePath, setFilePath] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      // 모든 필드 데이터를 가져오도록 설정
      const { data } = await supabase.from("posts").select("*").eq("id", id).single();
      if (data) {
        setTitle(data.title);
        setContent(data.content);
        setType(data.type);
        // 💡 DB에서 가져온 값을 상태에 저장
        setLocation(data.location || "");
        setExpiryDate(data.expiry_date ? data.expiry_date.split('T')[0] : ""); // 날짜 포맷팅 (YYYY-MM-DD)
        setFilePath(data.file_path || "");
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 💡 업데이트할 데이터 객체 구성
    const updateData: any = { 
      title, 
      content, 
      type,
      location: type === "notice" ? location : null, // notice일 때만 저장
      expiry_date: type === "notice" && expiryDate ? expiryDate : null, // notice일 때만 저장
      file_path: type === "archive" ? filePath : filePath // archive일 때 저장 (기본값 유지)
    };

    const { error } = await supabase
      .from("posts")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("수정 실패");
    } else {
      alert("수정되었습니다.");
      router.push("/admin/list"); // 목록으로 이동
    }
  };

  if (loading) return <div className="p-10 text-center text-[#0047AB] font-bold">불러오는 중...</div>;

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-10 text-slate-900">게시글 수정</h1>
      
      <form onSubmit={handleUpdate} className="space-y-6">
        {/* 카테고리 선택 (읽기 전용 추천 또는 표시) */}
        <div className="flex gap-4 mb-4">
          {["notice", "archive", "issue"].map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                checked={type === t} 
                onChange={() => setType(t)}
                className="w-4 h-4 accent-[#0047AB]"
              />
              <span className="text-sm font-medium text-slate-700 uppercase">{t}</span>
            </label>
          ))}
        </div>

        <input 
          className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-semibold" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="제목을 입력하세요"
        />

        {/* 💡 'notice'일 때만 나타나는 추가 항목 */}
        {type === "notice" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 ml-1">행사 장소 (Location)</label>
              <input 
                className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                placeholder="장소 입력"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 ml-1">만료일 (Expiry Date)</label>
              <input 
                type="date"
                className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm" 
                value={expiryDate} 
                onChange={(e) => setExpiryDate(e.target.value)} 
              />
            </div>
          </div>
        )}

        {/* 💡 'archive'일 때 파일 경로 확인/수정 (텍스트) */}
        {type === "archive" && (
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 ml-1">첨부파일 경로 (File Path)</label>
            <input 
              className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 text-sm focus:outline-none" 
              value={filePath} 
              onChange={(e) => setFilePath(e.target.value)} 
              placeholder="파일 경로"
            />
            <p className="text-[10px] text-slate-400 mt-2 ml-1">* 파일명 수정 시 실제 스토리지의 파일명과 일치해야 합니다.</p>
          </div>
        )}

        <textarea 
          className="w-full p-4 border border-slate-200 rounded-xl h-80 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none" 
          value={content} 
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
        />

        <div className="flex gap-4">
          <button 
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all"
          >
            취소
          </button>
          <button 
            type="submit"
            className="flex-[2] bg-[#0047AB] text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-all active:scale-95"
          >
            수정 완료
          </button>
        </div>
      </form>
    </div>
  );
}