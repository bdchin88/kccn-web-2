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
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-x-hidden"> {/* 가로 스크롤 방지 */}
      <Header />

      <main className="flex-grow max-w-5xl mx-auto py-12 px-4 w-full box-border">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-slate-900 tracking-tight text-center md:text-left">
          알림마당
        </h1>

        {/* 탭 네비게이션 - 모바일에서 좌우 스크롤 가능하게 수정 */}
        <div className="flex gap-6 mb-10 border-b border-gray-200 overflow-x-auto no-scrollbar whitespace-nowrap px-1">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={`/notice?type=${tab.id}`}
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

        {/* 게시글 목록 영역 */}
        {posts?.length === 0 ? (
          <div className="bg-white rounded-2xl py-20 text-center shadow-sm border border-gray-100">
            <p className="text-gray-400 font-medium">등록된 게시글이 없습니다.</p>
          </div>
        ) : (
          <div className="grid gap-5 w-full">
            {posts?.map((post) => (
              <Link
                key={post.id}
                href={`/notice/${post.id}`} // 🔹 경로가 정확한지 확인 (app/notice/[id]/page.tsx)
                className="group bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 block w-full box-border overflow-hidden"
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-2 mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-slate-800 group-hover:text-[#0047AB] transition-colors leading-snug break-all">
                    {post.title}
                  </h2>
                  <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full whitespace-nowrap">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                {/* 본문 요약 - break-all 추가하여 긴 영문/숫자도 줄바꿈 처리 */}
                <div className="text-slate-600 text-sm md:text-base leading-relaxed line-clamp-3 break-all">
                  {post.content}
                </div>

                <div className="mt-6 flex items-center text-[#0047AB] font-bold text-sm md:opacity-0 group-hover:opacity-100 transition-opacity">
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