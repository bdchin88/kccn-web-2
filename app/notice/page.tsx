//import { supabase } from "@/lib/supabase";
import { supabase } from "../../lib/supabase";
export default async function NoticePage() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("type", "notice")
    .order("created_at", { ascending: false });

  // 🔥 에러 처리 추가
  if (error) {
    console.error("Supabase error:", error);
    return <div>데이터 불러오기 실패</div>;
  }

  return (
    <main className="max-w-4xl mx-auto py-20 px-4">
      <Header />
      <h1 className="text-3xl font-bold mb-10">공지사항</h1>

      {/* 🔥 데이터 없을 때 처리 */}
      {posts?.length === 0 && (
        <p className="text-gray-500">공지사항이 없습니다.</p>
      )}

      <div className="space-y-6">
        {posts?.map((post) => (
          <div
            key={post.id}
            className="border p-5 rounded-lg hover:shadow transition"
          >
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
            <p className="mt-3">{post.content}</p>
          </div>
        ))}
      </div>
      <Footer />
    </main>
  );
}