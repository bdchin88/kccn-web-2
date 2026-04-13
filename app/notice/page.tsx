import { supabase } from "../../lib/supabase";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
// 비활성화되었던 import가 아래에서 사용됨에 따라 활성화됩니다.
import Pagination from "@/components/pagination";

export default async function NoticePage(props: {
  searchParams: Promise<{ type?: string; page?: string }>;
}) {
  // 1. 파라미터 처리 (Next.js 15+ 대응)
  const resolvedSearchParams = await props.searchParams;
  const activeTab = resolvedSearchParams.type || "notice";
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const itemsPerPage = 10;

  // 2. 페이지네이션 범위 계산
  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  // 3. Supabase 데이터 및 전체 개수 가져오기
  const { data: posts, count } = await supabase
    .from("posts")
    .select("*", { count: "exact" })
    .eq("type", activeTab)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .range(from, to);

  const totalPages = count ? Math.ceil(count / itemsPerPage) : 1;

  const tabs = [
    { id: "notice", label: "공지사항" },
    { id: "issue", label: "이슈와 정보" },
    { id: "archive", label: "자료실" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />

      <main className="flex-grow w-full max-w-5xl mx-auto py-12 px-4 box-border">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-slate-900 text-center md:text-left">
          알림마당
        </h1>

        {/* 탭 네비게이션 */}
        <div className="flex gap-6 mb-10 border-b border-gray-200 overflow-x-auto whitespace-nowrap pb-1 no-scrollbar">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={`/notice?type=${tab.id}&page=1`}
              prefetch={false}
              className={`pb-4 text-base md:text-lg font-bold transition-all ${
                activeTab === tab.id
                  ? "border-b-4 border-[#0047AB] text-[#0047AB]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* 게시글 목록 */}
        <div className="grid gap-6 w-full max-w-full">
          {posts?.length === 0 ? (
            <div className="bg-white rounded-2xl py-20 text-center border border-gray-100 shadow-sm">
              <p className="text-gray-400">등록된 게시글이 없습니다.</p>
            </div>
          ) : (
            posts?.map((post) => (
              <Link
                key={post.id}
                href={`/notice/${post.id}`}
                className="group bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all block w-full box-border overflow-hidden"
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-3 mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-slate-800 group-hover:text-[#0047AB] transition-colors leading-tight break-words overflow-hidden">
                    {post.title}
                  </h2>
                  <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full whitespace-nowrap self-start">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="text-slate-600 text-sm md:text-base leading-relaxed line-clamp-3 break-words">
                  {post.content}
                </div>

                <div className="mt-6 flex items-center text-[#0047AB] font-bold text-sm">
                  자세히 보기 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* ▽ 수정된 부분: 분리된 Pagination 컴포넌트를 사용합니다 ▽ */}
        {totalPages > 1 && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            currentType={activeTab} 
          />
        )}
      </main>

      <Footer />
    </div>
  );
}