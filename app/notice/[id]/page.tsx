// app/notice/[id]/page.tsx
import { supabase } from "../../../lib/supabase";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PostDetailPage(props: { params: Promise<{ id: string }> }) {
  // Next.js 15+ 에서는 params를 반드시 await로 받아야 합니다.
  const params = await props.params;
  const id = params.id;

  if (!id) return notFound();

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !post) {
    return notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto py-20 px-4 w-full">
        <h1 className="text-3xl font-bold mb-6">{post.title}</h1>
        <div className="prose max-w-none whitespace-pre-wrap">{post.content}</div>
      </main>
      <Footer />
    </div>
  );
}