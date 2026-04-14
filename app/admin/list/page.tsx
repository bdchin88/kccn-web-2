"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

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

  const handleAuth = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthorized(true);
    } else {
      alert("비밀번호가 틀립니다.");
    }
  };

  const handleDelete = async (id: string, filePath: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    if (filePath) await supabase.storage.from("resources").remove([filePath]);
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) alert("삭제 실패");
    else fetchPosts();
  };

  // 인증 전 화면 (admin/write와 동일한 디자인)
  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 w-full max-w-sm">
          <h1 className="text-xl font-bold mb-4 text-center text-slate-900">수정/삭제 관리자 인증</h1>
          <p className="text-sm text-gray-500 mb-6 text-center">콘텐츠 관리를 위해 비밀번호를 입력하세요.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
            className="w-full p-3 border rounded-lg mb-4 outline-none focus:ring-2 focus:ring-[#0047AB] transition-all"
            placeholder="비밀번호 입력"
          />
          <button
            onClick={handleAuth}
            className="w-full bg-[#0047AB] text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors"
          >
            접속하기
          </button>
        </div>
      </div>
    );
  }

  // 인증 후 관리 목록 화면
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">콘텐츠 관리</h1>
          <p className="text-slate-500 text-sm mt-1">등록된 모든 게시물을 수정하거나 삭제할 수 있습니다.</p>
        </div>
        <Link href="/admin/write" className="bg-[#0047AB] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-sm">
          새 글 쓰기
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase">구분</th>
              <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase">제목</th>
              <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase">작성일</th>
              <th className="p-4 text-center text-xs font-bold text-gray-500 uppercase">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="p-4">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${
                    post.type === 'notice' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {post.type}
                  </span>
                </td>
                <td className="p-4 font-semibold text-slate-800">{post.title}</td>
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
            ))}
          </tbody>
        </table>
        {posts.length === 0 && !loading && (
          <div className="p-20 text-center text-gray-400">데이터가 없습니다.</div>
        )}
      </div>
    </div>
  );
}