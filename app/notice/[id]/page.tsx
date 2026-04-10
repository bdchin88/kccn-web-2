// app/notice/[id]/page.tsx
import { supabase } from "../../../lib/supabase";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PostDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  if (!id) return notFound();

  // type 컬럼을 함께 가져옵니다.
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !post) {
    return notFound();
  }

  // 원래 탭으로 돌아가기 위한 경로 설정
  // type이 'notice'가 아니면 ?type=카테고리 주소를 생성합니다.
  const backPath = post.type === "notice" ? "/notice" : `/notice?type=${post.type}`;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-grow max-w-4xl mx-auto py-16 px-4 w-full">
        {/* 상단 목록가기: 원래 보던 탭으로 이동 */}
        <div className="mb-8">
          <Link 
            href={backPath} 
            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#0047AB] transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            목록으로 돌아가기
          </Link>
        </div>

        <article>
          <header className="border-b border-gray-100 pb-8 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="text-sm text-gray-400">
              {new Date(post.created_at).toLocaleDateString()}
            </div>
          </header>

          <div className="prose max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap min-h-[300px]">
            {post.content}
          </div>
        </article>

        {/* 하단 목록보기 버튼: 원래 보던 탭으로 이동 */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex justify-center">
          <Link 
            href={backPath}
            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-[#0047AB] transition-all shadow-sm"
          >
            목록보기
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}