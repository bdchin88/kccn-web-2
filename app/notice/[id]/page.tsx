import { supabase } from "../../../lib/supabase";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  // 1. 해당 ID의 게시글을 Supabase에서 조회
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", params.id)
    .single();

  // 2. 글이 없거나 에러가 나면 404 페이지로 보냄
  if (error || !post) {
    return notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto py-20 px-4 w-full">
        {/* 상단 이동 버튼 */}
        <Link
          href={`/notice?type=${post.type}`}
          className="inline-flex items-center text-gray-500 hover:text-[#0047AB] mb-8 transition-colors group"
        >
          <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          목록으로 돌아가기
        </Link>

        {/* 게시글 제목 섹션 */}
        <header className="mb-10 border-b pb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0047AB] text-sm font-bold">
              {post.type === 'notice' ? '공지사항' : post.type === 'issue' ? '이슈와 정보' : '자료실'}
            </span>
            <span className="text-gray-400 text-sm">
              {new Date(post.created_at).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
            {post.title}
          </h1>
        </header>

        {/* 게시글 본문 섹션 */}
        <article className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap min-h-[400px]">
          {post.content}
        </article>

        {/* 하단 버튼 */}
        <div className="mt-16 pt-8 border-t flex justify-center">
          <Link
            href={`/notice?type=${post.type}`}
            className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-[#0047AB] transition-colors"
          >
            목록보기
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}