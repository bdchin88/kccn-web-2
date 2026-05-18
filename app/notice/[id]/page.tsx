// app/notice/[id]/page.tsx : 접속제한 추가 
import { supabase } from "../../../lib/supabase";
import Header from "@/components/header"; // ◀ 역슬래시(\) 제거 완료
import Footer from "@/components/footer"; // ◀ 역슬래시(\) 제거 완료
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import DownloadSection from "@/components/DownloadSection"; // ◀ 역슬래시(\) 제거 완료
import DeleteButton from "@/components/DeleteButton"; // ◀ 역슬래시(\) 제거 완료

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

          {/* 💡 [방식 A 핵심 변환] 일반 텍스트 출력에서 HTML 렌더링 구조로 변경 */}
          {/* 기존 whitespace-pre-wrap 문맥 호환 및 이미지 스타일을 전역 제어하기 위해 prose 클리닝 클래스 유지 */}
          <div 
            className="prose max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap min-h-[300px] break-words"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* 📌 파일 다운로드 섹션: 보안 로직이 포함된 클라이언트 컴포넌트 호출 */}
          {post.has_file && post.file_path && (
            <DownloadSection filePath={post.file_path} />
          )}
        </article>

        <div className="mt-16 pt-8 border-t border-gray-100 flex justify-start">
          <Link
            href={backPath}
            className="flex items-center gap-2 text-slate-600 hover:text-[#0047AB] font-bold transition-colors group text-sm"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            목록으로 돌아가기
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}