import { supabase } from "../../../lib/supabase";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

// Next.js 14/15 버전의 비동기 params 대응
export default async function PostDetailPage({ params }: { params: any }) {
  // 1. params를 기다렸다가 id를 추출합니다.
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) return notFound();

  // 2. 데이터 가져오기
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  // 3. 데이터가 없으면 404
  if (error || !post) {
    return notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto py-20 px-4 w-full">
        <Link href={`/notice?type=${post.type || 'notice'}`} className="text-gray-400 hover:text-[#0047AB] mb-8 inline-block">
          ← 목록으로 돌아가기
        </Link>
        <article>
          <h1 className="text-3xl md:text-4xl font-black mb-6">{post.title}</h1>
          <div className="text-gray-400 mb-10 pb-5 border-b">
            {new Date(post.created_at).toLocaleDateString()}
          </div>
          <div className="text-lg leading-relaxed whitespace-pre-wrap text-slate-700">
            {post.content}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
