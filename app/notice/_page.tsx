// app/notice/page.tsx 
"use client";

import { supabase } from "../../lib/supabase";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import Pagination from "@/components/pagination";
import { useState, useEffect, use } from "react"; 
import { useRouter } from "next/navigation";
import { checkAdminLock } from "@/lib/auth"; // 공통 보안 함수

export const dynamic = "force-dynamic";

export default function NoticePage(props: {
  searchParams: Promise<{ type?: string; page?: string }>;
}) {
  const searchParams = use(props.searchParams);
  const router = useRouter();
  
  const [posts, setPosts] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0); // ◀ count 대신 totalCount로 이름 변경 (충돌 방지)
  const [loading, setLoading] = useState(true);

  const activeTab = searchParams.type || "notice";
  const currentPage = Number(searchParams.page) || 1;
  const itemsPerPage = 10;

  // 1. 데이터 불러오기 로직 (수정됨)
  const fetchPosts = async () => {
    setLoading(true);
    
    // 페이지 범위 계산 (1페이지: 0~9, 2페이지: 10~19)
    const from = (currentPage - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    // Supabase에서 count: "exact" 옵션으로 전체 개수를 꼭 가져와야 합니다.
    const { data, count: fetchedCount, error } = await supabase
      .from("posts")
      .select("*", { count: "exact" }) // ◀ 전체 개수를 가져오는 핵심 옵션
      .eq("type", activeTab)
      .order("created_at", { ascending: false })
      .range(from, to); // ◀ 10개 단위로 데이터 제한

    if (!error) {
      setPosts(data || []);
      setTotalCount(fetchedCount || 0); // ◀ 16이라는 숫자가 여기에 정상적으로 저장됨
    }
    setLoading(false);
  };

  // 탭이나 페이지 번호가 변경될 때마다 데이터를 다시 불러옴
  useEffect(() => {
    fetchPosts();
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, [activeTab, currentPage]); // ◀ currentPage 의존성 추가 (필수)

  const handleWriteClick = () => {
    const lockStatus = checkAdminLock();
    if (lockStatus.isLocked) {
      alert(`보안상 이유로 접속이 제한되었습니다. ${lockStatus.remaining}초 후 다시 시도하세요.`);
      return;
    }
    router.push("/admin/write");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-grow max-w-6xl mx-auto py-16 px-4 w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">공지 및 자료</h1>
            <p className="text-gray-500">협회의 주요 소식과 관련 자료를 확인하실 수 있습니다.</p>
          </div>
          
          <button 
            onClick={handleWriteClick}
            className="bg-blue-800 text-white px-6 py-1 rounded-xl font-bold hover:bg-[#0047AB] transition-all shadow-lg flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <span className="text-xl">+</span> 글쓰기
          </button>
        </div>

        {/* 탭 메뉴 - 이슈와 정보 포함 */}
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

        {/* 게시글 목록 */}
        <div className="grid gap-6 min-h-[400px]">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0047AB]"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
              <p className="text-gray-400 text-lg">등록된 게시글이 없습니다.</p>
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
              </div>
            ))
          )}
        </div>

        {/* 📌 페이지네이션 핵심: totalCount가 10(itemsPerPage)보다 클 때 노출 */}
        {!loading && totalCount > itemsPerPage && (
          <div className="mt-12 flex justify-center">
            <Pagination 
              totalItems={totalCount} 
              itemsPerPage={itemsPerPage} 
              currentPage={currentPage} 
              renderPageLink={(page) => `/notice?type=${activeTab}&page=${page}`}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}