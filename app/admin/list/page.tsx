"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { checkAdminLock, recordFailAttempt, resetAuthAttempts } from "@/lib/auth"; 
import Pagination from "@/components/pagination"; // ◀ 페이지네이션 컴포넌트 추가

export default function AdminListPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  
  // 💡 페이지네이션을 위한 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10; // 10개씩 보기

  const [isAuthorized, setIsAuthorized] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("admin_auth") === "true";
    }
    return false;
  });

  // 💡 페이지가 바뀌거나 인증될 때마다 데이터를 새로 불러옴
  useEffect(() => {
    if (isAuthorized) fetchPosts();
  }, [isAuthorized, currentPage]);

  const fetchPosts = async () => {
    setLoading(true);
    
    // 1. 페이징 범위 계산
    const from = (currentPage - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    // 2. 데이터와 전체 개수 가져오기
    const { data, count } = await supabase
      .from("posts")
      .select("*", { count: "exact" }) // 전체 개수 포함
      .order("created_at", { ascending: false })
      .range(from, to); // ◀ 10개씩 끊어서 가져오기

    setPosts(data || []);
    setTotalCount(count || 0);
    setLoading(false);
  };

  const handleAuth = () => {
    const lockStatus = checkAdminLock();
    if (lockStatus.isLocked) {
      alert(`보안상 이유로 인증이 제한되었습니다. ${lockStatus.remaining}초 후 다시 시도하세요.`);
      return;
    }

    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      resetAuthAttempts();
      setIsAuthorized(true);
      sessionStorage.setItem("admin_auth", "true");
    } else {
      const isLockedNow = recordFailAttempt();
      if (isLockedNow) {
        alert("비밀번호 5회 오류로 인해 1분간 인증 시도가 제한됩니다.");
      } else {
        const attempts = localStorage.getItem("admin_pw_attempts");
        alert(`비밀번호가 틀립니다. (현재 ${attempts}/5회 오류)`);
      }
      setPassword("");
    }
  };

  const handleDelete = async (id: string, filePath: string) => {
    if (!confirm("정말 삭제하시겠습니까??")) return;
    
    if (filePath) {
      await supabase.storage.from("resources").remove([filePath]);
    }
    
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      alert("삭제 실패");
    } else {
      alert("삭제되었습니다.");
      fetchPosts(); 
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setIsAuthorized(false);
    window.location.href = "/"; 
  };

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
    <div className="max-w-6xl mx-auto py-16 px-4 flex flex-col min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900">게시글 관리 목록</h1>
        <Link 
          href="/admin/write" 
          className="bg-[#0047AB] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors"
        >
          새 글 등록
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex-grow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-100">
              {/* py-2 또는 py-3 정도로 수정하면 위아래 높이 조절, 기본 p-1은 0.25rem 단위, 글자 자체의 높이(leading-tight)를 조절할 수 있음 */}
              <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">구 분</th>
              <th className="px-10 py-3 text-xs font-bold text-gray-500 uppercase">제 목</th>
              <th className="px-7 py-3 text-xs font-bold text-gray-500 uppercase">작성일</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase text-center">관 리</th>
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
                <tr key={post.id} className="hover:bg-blue-50/30 transition-colors border-b border-gray-50">
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase whitespace-nowrap inline-block shrink-0 ${
                      post.type === 'notice' 
                        ? 'bg-blue-100 text-blue-600' 
                        : post.type === 'issue'
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {post.type === 'notice' ? '공지' : post.type === 'issue' ? '정보' : '자료'}
                    </span>
                  </td>
                  <td className="p-0 font-semibold text-slate-800">
                    <div className="line-clamp-2">{post.title}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-400 whitespace-nowrap">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-center space-x-3 whitespace-nowrap">
                    <Link href={`/admin/edit/${post.id}`} className="text-[#0047AB] hover:underline font-bold text-sm">수정</Link>
                    <button onClick={() => handleDelete(post.id, post.file_path)} className="text-red-500 hover:text-red-700 font-bold text-sm">삭제</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 💡 [추가] 페이지네이션 UI 컨트롤 */}
      <div className="mt-8 flex justify-center">
        <div className="flex gap-2">
          {Array.from({ length: Math.ceil(totalCount / itemsPerPage) }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                currentPage === pageNum
                  ? "bg-[#0047AB] text-white shadow-md"
                  : "bg-white text-gray-400 border border-gray-100 hover:bg-gray-50"
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 flex justify-center pb-10">
        <button 
          onClick={handleLogout}
          className="bg-[#0047AB] text-white px-10 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
        >
          관리자 로그아웃
        </button>
      </div>
    </div>
  );
}