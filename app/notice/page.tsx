import { supabase } from "../../lib/supabase";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";

export default async function NoticePage({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  const activeTab = searchParams.type || "notice";

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("type", activeTab)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const tabs = [
    { id: "notice", label: "공지사항" },
    { id: "issue", label: "이슈와 정보" },
    { id: "archive", label: "자료실" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow max-w-5xl mx-auto py-16 px-4 w-full">
        <h1 className="text-4xl font-extrabold mb-10 text-slate-900 tracking-tight text-center md:text-left">
          알림마당
        </h1>

        {/* 탭 네비게이션 */}
        <div className="flex gap-8 mb-12 border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={`/notice?type=${tab.id}`}
              className={`pb-4 text-lg font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-b-4 border-[#0047AB] text-[#0047AB]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* 게시글 목록 영역 */}
        {posts?.length === 0 ? (
          <div className="bg-white rounded-3xl py-24 text-center shadow-sm border border-gray-100">
            <p className="text-gray-400 text-lg font-medium">등록된 게시글이 없습니다.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts?.map((post) => (
              <Link
                key={post.id}
                href={`/notice/${post.id}`} // ✅ 상세 페이지 링크 적용
                className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-slate-800 group-hover:text-[#0047AB] transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <span className="text-sm font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full flex-shrink-0 ml-4">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                {/* 본문 요약 (3줄만 표시) */}
                <div className="text-slate-600 leading-relaxed line-clamp-3">
                  {post.content}
                </div>

                <div className="mt-6 flex items-center text-[#0047AB] font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  자세히 보기 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}