import { supabase } from "../../../lib/supabase";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  // 1. ID 값 추출
  const id = params.id;

  // 2. 데이터 조회
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle(); // single() 대신 maybeSingle()로 에러 방지

  if (error || !post) {
    return notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto py-12 md:py-20 px-4 w-full">
        {/* 상단 목록 버튼 - 항상 보이도록 배치 */}
        <div className="mb-8">
          <Link
            href={`/notice?type=${post.type || 'notice'}`}
            className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-[#0047AB] transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            목록으로 돌아가기
          </Link>
        </div>

        <article className="w-full">
          <header className="mb-10 border-b pb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0047AB] text-xs font-bold uppercase">
                {post.type === 'notice' ? '공지사항' : '이슈와 정보'}
              </span>
              <span className="text-gray-400 text-sm">
                {new Date(post.created_at).toLocaleDateString('ko-KR')}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight break-words">
              {post.title}
            </h1>
          </header>

          {/* 본문 내용 - 줄바꿈 보존 및 가독성 확보 */}
          <div className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap break-words overflow-hidden">
            {post.content}
          </div>
        </article>

        {/* 하단 목록 버튼 */}
        <div className="mt-16 pt-8 border-t flex justify-center">
          <Link
            href={`/notice?type=${post.type || 'notice'}`}
            className="px-10 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-[#0047AB] transition-all"
          >
            목록보기
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}