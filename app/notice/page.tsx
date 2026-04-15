"use client";

import { supabase } from "../../lib/supabase";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import Pagination from "@/components/pagination";
import { useState, useEffect, use } from "react"; // ◀ use 추가

// 배포 환경에서 캐싱을 방지하고 항상 최신 데이터를 불러오도록 설정
export const dynamic = "force-dynamic";

export default function NoticePage(props: {
  searchParams: Promise<{ type?: string; page?: string }>; // ◀ Next.js 15 타입 명시
}) {
  // 1. Next.js 15의 비동기 searchParams를 해제(unwrap)합니다.
  // 이 작업을 통해 URL이 바뀔 때마다 컴포넌트가 리렌더링됩니다.
  const searchParams = use(props.searchParams);
  
  const [posts, setPosts] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // searchParams에서 직접 값을 추출하여 사용 (useState와 sync 맞출 필요 없음)
  const activeTab = searchParams.type || "notice";
  const currentPage = Number(searchParams.page) || 1;
  const itemsPerPage = 10;

  // 2. 데이터 불러오기 로직
  const fetchPosts = async () => {
    setLoading(true);
    const from = (currentPage - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    const { data, count: totalCount } = await supabase
      .from("posts")
      .select("*", { count: "exact" })
      .eq("type", activeTab)
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .range(from, to);

    setPosts(data || []);
    setCount(totalCount || 0);
    setLoading(false);
  };

  // 탭(activeTab)이나 페이지(currentPage)가 바뀔 때마다 데이터를 다시 불러옵니다.
  useEffect(() => {
    fetchPosts();
  }, [activeTab, currentPage]);

  // 3. 삭제 처리 함수 (resources 버킷 이름 반영 완료)
  const handleDelete = async (id: string, filePath: string) => {
    const adminPw = prompt("관리자 비밀번호를 입력하세요.");
    
    if (adminPw !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!confirm("정말 이 게시글을 삭제하시겠습니까?")) return;

    try {
      if (filePath) {
        // 버킷 이름을 resources로 정확히 지정
        await supabase.storage.from("resources").remove([filePath]);
      }

      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;

      alert("삭제되었습니다.");
      fetchPosts(); 
    } catch (err: any) {
      alert("삭제 실패: " + err.message);
    }
  };

  const totalPages = Math.ceil(count / itemsPerPage) || 1;

  const tabs = [
    { id: "notice", label: "공지사항" },
    { id: "issue", label: "이슈와 정보" },
    { id: "archive", label: "자료실" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />
      <main className="flex-grow w-full max-w-5xl mx-auto py-12 px-4 box-border">
        <div className="flex justify-between items-end mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">알림마당</h1>
          <Link href="/admin/write" className="text-sm bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700">
            글쓰기
          </Link>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex gap-6 mb-10 border-b border-gray-200 overflow-x-auto pb-1 no-scrollbar">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={`/notice?type=${tab.id}&page=1`}
              className={`pb-4 text-base md:text-lg font-bold transition-all ${
                activeTab === tab.id ? "border-b-4 border-[#0047AB] text-[#0047AB]" : "text-gray-400"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* 게시글 목록 */}
        <div className="grid gap-6 w-full">
          {loading ? (
            <div className="py-20 text-center text-gray-400">불러오는 중...</div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-2xl py-20 text-center border border-gray-100 shadow-sm">
              <p className="text-gray-400">등록된 게시글이 없습니다.</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="relative group">
                <Link href={`/notice/${post.id}`} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg block transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800 group-hover:text-[#0047AB] leading-tight">{post.title}</h2>
                    <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="text-slate-600 line-clamp-2 mb-4">{post.content}</div>
                  <div className="text-[#0047AB] font-bold text-sm">자세히 보기 →</div>
                </Link>
                <button onClick={() => handleDelete(post.id, post.file_path)} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 bg-red-50 text-red-500 p-2 rounded-md text-xs font-bold hover:bg-red-500 hover:text-white transition-all">
                  삭제
                </button>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} currentType={activeTab} />}
      </main>
      <Footer />
    </div>
  );
}