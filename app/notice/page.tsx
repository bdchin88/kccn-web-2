// page.tsx 수정본
import { supabase } from "../../lib/supabase";
import Header from "@/components/Header"; // 헤더 컴포넌트 경로 확인 필요
import Footer from "@/components/Footer"; // 푸터 컴포넌트 경로 확인 필요

export default async function NoticePage() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("type", "notice")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    return <div className="p-20 text-center">데이터 불러오기 실패</div>;
  }

  return (
    <div className="flex flex-col min-h-screen"> {/* 전체 화면 높이 유지 */}
      <Header /> {/* 1. 최상단 헤더 위치 */}

      <main className="flex-grow max-w-4xl mx-auto py-20 px-4 w-full"> {/* 2. 본문 영역 */}
        <h1 className="text-3xl font-bold mb-10 border-b pb-4">공지사항</h1>

        {posts?.length === 0 && (
          <p className="text-gray-500 text-center py-10">공지사항이 없습니다.</p>
        )}

        <div className="space-y-6">
          {posts?.map((post) => (
            <div
              key={post.id}
              className="border p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-xl font-bold text-slate-800">{post.title}</h2>
              <p className="text-sm text-gray-400 mt-2">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
              <div className="mt-4 text-slate-600 whitespace-pre-wrap">
                {post.content}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer /> {/* 3. 최하단 푸터 위치 */}
    </div>
  );
}