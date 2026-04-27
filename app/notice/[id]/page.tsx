// app/notice/[id]/page.tsx : 접속제한 추가
import { supabase } from "../../../lib/supabase";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import DownloadSection from "@/components/DownloadSection";
import DeleteButton from "@/components/DeleteButton"; // ◀ 이미 적용된 삭제 버튼

export const dynamic = "force-dynamic";

export default async function PostDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  if (!id) return notFound();

  // 게시글 정보와 파일 관련 필드(file_path, has_file)를 함께 가져옵니다.
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !post) {
    return notFound();
  }

  const backPath = post.type === "notice" ? "/notice" : `/notice?type=${post.type}`;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-grow max-w-4xl mx-auto py-16 px-4 w-full">
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
            <div className="flex justify-between items-center text-sm text-gray-400">
              <div>{new Date(post.created_at).toLocaleDateString()}</div>
              {/* 📌 삭제 버튼: 이미 lib/auth.ts 기반의 로직이 적용되어 있어야 함 */}
              <DeleteButton postId={post.id} />
            </div>
          </header>

          <div className="prose max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap min-h-[300px]">
            {post.content}
          </div>

          {/* 📌 파일 다운로드 섹션: 보안 로직이 포함된 클라이언트 컴포넌트 호출 */}
          {post.has_file && post.file_path && (
            <DownloadSection filePath={post.file_path} />
          )}
        </article>

        <div className="mt-16 pt-8 border-t border-gray-100 flex justify-center">
          <Link
            href={backPath}
            className="bg-[#0047AB] text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg"
          >
            목록보기
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}