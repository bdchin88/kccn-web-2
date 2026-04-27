// app/admin/list/page.tsx 
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { checkAdminLock, recordFailAttempt, resetAuthAttempts } from "@/lib/auth"; // ◀ 보안 공통 함수 추가

export default function AdminListPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isAuthorized) fetchPosts();
  }, [isAuthorized]);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  // 1. 관리자 인증 (보안 로직 적용)
  const handleAuth = () => {
    // 📌 [보안 추가] 잠금 상태인지 먼저 확인
    const lockStatus = checkAdminLock();
    if (lockStatus.isLocked) {
      alert(`보안상 이유로 인증이 제한되었습니다. ${lockStatus.remaining}초 후 다시 시도하세요.`);
      return;
    }

    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      // ✅ 성공 시: 잠금 기록 초기화 및 목록 표시
      resetAuthAttempts();
      setIsAuthorized(true);
    } else {
      // ❌ 실패 시: 횟수 기록 및 잠금 처리
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

  const handleDelete = async (id: string, filePath: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    
    // 파일이 있는 경우 스토리지에서도 삭제
    if (filePath) {
      await supabase.storage.from("archives").remove([filePath]);
    }
    
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      alert("삭제 실패");
    } else {
      alert("삭제되었습니다.");
      fetchPosts(); // 목록 새로고침
    }
  };

  // 인증 전 화면
  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-2 text-slate-900">게시글 관리</h1>
          <p className="text-sm text-slate-500 mb-6">목록 조회를 위해 관리자 인증이 필요합니다.</p>
          <input
            type="password"
            autoFocus
            className="w-full p-4 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-center"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
          />
          <button
            onClick={handleAuth}
            className="w-full bg-[#0047AB] text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
          >
            인증 및 목록보기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900">게시글 관리 목록</h1>
        <Link 
          href="/admin/write" 
          className="bg-[#0047AB] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors"
        >
          새 글 등록
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-100">
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">구분</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">제목</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">작성일</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-20 text-center text-gray-400">데이터를 불러오는 중입니다...</td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-20 text-center text-gray-400">등록된 게시글이 없습니다.</td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${
                      post.type === 'notice' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {post.type === 'notice' ? '공지' : '자료'}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-slate-800 line-clamp-1">{post.title}</td>
                  <td className="p-4 text-sm text-gray-400">{new Date(post.created_at).toLocaleDateString()}</td>
                  <td className="p-4 text-center space-x-3">
                    <Link href={`/admin/edit/${post.id}`} className="text-[#0047AB] hover:underline font-bold text-sm">수정</Link>
                    <button 
                      onClick={() => handleDelete(post.id, post.file_path)} 
                      className="text-red-500 hover:text-red-700 font-bold text-sm"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}