// app/notice/page.tsx 
"use client";

import { supabase } from "../../lib/supabase";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import Pagination from "@/components/pagination"; // 기존에 쓰시던 공통 컴포넌트
import { useState, useEffect, use } from "react"; 
import { useRouter } from "next/navigation";
import { checkAdminLock } from "@/lib/auth"; 

export const dynamic = "force-dynamic";

export default function NoticePage(props: {
  searchParams: Promise<{ type?: string; page?: string }>;
}) {
  const searchParams = use(props.searchParams);
  const router = useRouter();
  
  const [posts, setPosts] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0); 
  const [loading, setLoading] = useState(true);

  const activeTab = searchParams.type || "notice";
  const currentPage = Number(searchParams.page) || 1;
  const limit = 10;

  // 잘 동작하는 참고 코드의 핵심 로직 반영
  const fetchPosts = async () => {
    setLoading(true);
    
    const from = (currentPage - 1) * limit;
    const to = from + limit - 1;

    const { data, count } = await supabase
      .from("posts")
      .select("*", { count: "exact" }) 
      .eq("type", activeTab)
      .order("created_at", { ascending: false })
      .range(from, to); 

    setPosts(data || []);
    setTotalCount(count || 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, [activeTab, currentPage]); // 탭이나 페이지 변경 시 실행

  const handleWriteClick = () => {
    if (checkAdminLock().isLocked) return;
    router.push("/admin/write");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow max-w-6xl mx-auto py-16 px-4 w-full">
        {/* 상단 레이아웃 */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">공지 및 자료</h1>
            <p className="text-gray-500">협회의 주요 소식과 관련 자료를 확인하실 수 있습니다.</p>
          </div>
          <button 
            onClick={handleWriteClick}
            className="bg-blue-800 text-white px-6 py-1 rounded-xl font-bold whitespace-nowrap shrink-0 transition-all hover:bg-[#0047AB]"
          >
            <span className="text-xl">+</span> 글쓰기
          </button>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex border-b border-gray-100 mb-10 overflow-x-auto no-scrollbar">
          {[
            { id: "notice", label: "공지사항" },
            { id: "archive", label: "자료실" },
            { id: "issue", label: "이슈와 정보" },
          ].map((tab) => (
            <Link
              key={tab.id}
              href={`/notice?type=${tab.id}&page=1`}
              className={`px-8 py-4 text-lg font-bold transition-all relative whitespace-nowrap ${
                activeTab === tab.id ? "text-[#0047AB]" : "text-gray-400 hover:text-slate-600"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0047AB] rounded-t-full" />
              )}
            </Link>
          ))}
        </div>

        {/* 리스트 출력 */}
        <div className="grid gap-6 min-h-[400px]">
          {loading ? (
            <div className="flex justify-center py-20 text-blue-500">로딩 중...</div>
          ) : posts.map((post) => (
            <Link key={post.id} href={`/notice/${post.id}`} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg block transition-all">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 group-hover:text-[#0047AB] leading-tight">{post.title}</h2>
                <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
              <div className="text-slate-600 line-clamp-2 mb-4">{post.content}</div>
              <div className="text-[#0047AB] font-bold text-sm">자세히 보기 →</div>
            </Link>
          ))}
        </div>

        {/* 페이지네이션 버튼 (참고 코드의 로직 적용) */}
        {!loading && totalCount > limit && (
          <div className="mt-12 flex justify-center gap-2">
            {Array.from({ length: Math.ceil(totalCount / limit) }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => router.push(`/notice?type=${activeTab}&page=${num}`)}
                className={`px-4 py-2 border rounded-lg font-bold transition-all ${
                  currentPage === num ? "bg-[#0055AB] text-white border-[#0055AB]" : "bg-white text-gray-400 hover:bg-gray-50"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}