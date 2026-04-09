import { supabase } from "../../../lib/supabase";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { notFound } from "next/navigation";

// 🔹 실서버에서 동적 페이지가 즉시 반영되도록 설정
export const dynamic = "force-dynamic"; 

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  // params가 프라미스인 경우를 대비해 await 처리 (Next.js 14-15 대응)
  const id = params.id;

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !post) {
    return notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto py-20 px-4 w-full">
        <Link
          href={`/notice?type=${post.type}`}
          className="inline-flex items-center text-gray-500 hover:text-[#0047AB] mb-8 transition-colors"
        >
          ← 목록으로 돌아가기
        </Link>

        <article>
          <header className="mb-10 border-b pb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0047AB] text-sm font-bold uppercase">
                {post.type}
              </span>
              <span className="text-gray-400 text-sm">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
              {post.title}
            </h1>
          </header>

          <div className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}