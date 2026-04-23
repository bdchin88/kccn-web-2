import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function PlacardServer() {
  const now = new Date().toISOString();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("type", "notice")
    .or(`expiry_date.is.null,expiry_date.gt.${now}`)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("공지 불러오기 오류:", error);
    return null;
  }

  return (
    <div className="bg-white py-6 border-b">
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="font-bold mb-4 text-lg">공지사항</h3>

        <ul className="space-y-3">
          {posts?.map((post) => (
            <li key={post.id}>
              <Link
                href="/notice"
                className="block p-3 rounded-md hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{post.title}</span>
                  <span className="text-sm text-gray-400">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* 장소 표시 */}
                {post.location && (
                  <p className="text-xs text-gray-500 mt-1">
                    📍 {post.location}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* 전체보기 */}
        <div className="mt-4 text-right">
          <Link
            href="/notice"
            className="text-sm text-gray-500 hover:underline"
          >
            전체 공지 보기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
