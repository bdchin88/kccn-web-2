import { supabase } from "../../../lib/supabase";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { notFound } from "next/navigation";

// 서버 사이드 렌더링 강제 및 캐시 무효화
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PostDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> | { id: string } 
}) {
  // 1. Next.js 버전 차이에 따른 params 처리 (Promise 대응)
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) return notFound();

  // 2. Supabase 데이터 조회
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  // 3. 에러 발생 시 로그 출력 및 404 처리
  if (error || !post) {
    console.error("상세페이지 조회 에러:", error);
    return notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto py-12 md:py-20 px-4 w-full box-border">
        {/* 상단 목록가기 버튼 */}
        <div className="mb-10">
          <Link
            href={`/notice?type=${post.type || 'notice'}`}
            className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-[#0047AB] transition-all group"
          >
            <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
            목록으로 돌아가기
          </Link>
        </div>

        <article className="w-full">
          <header className="mb-12 border-b border-gray-100 pb-10">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1.5 rounded-full bg-blue-50 text-[#0047AB] text-xs font-extrabold uppercase tracking-wider">
                {post.type === 'issue' ? '이슈와 정보' : post.type === 'notice' ? '공지사항' : '알림'}
              </span>
              <time className="text-gray-400 text-sm font-medium">
                {new Date(post.created_at).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight break-all">
              {post.title}
            </h1>
          </header>

          {/* 본문 - tailwind prose 미설치 시를 대비해 수동 스타일 적용 */}
          <div className="text-slate-700 text-base md:text-lg leading-relaxed whitespace-pre-wrap break-words min-h-[300px]">
            {post.content}
          </div>
        </article>

        {/* 하단 버튼 */}
        <div className="mt-20 pt-10 border-t border-gray-100 flex justify-center">
          <Link
            href={`/notice?type=${post.type || 'notice'}`}
            className="px-12 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-[#0047AB] transition-all shadow-lg hover:shadow-blue-200"
          >
            목록보기
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}