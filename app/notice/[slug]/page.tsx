import { supabase } from "@/lib/supabase";

export default async function NoticeDetail({ params }: any) {
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", params.slug)
    .single()

  if (!post) return <div>존재하지 않는 글</div>

  return (
    <div className="max-w-3xl mx-auto py-20">
      <h1 className="text-3xl font-bold mb-6">{post.title}</h1>

      <div className="text-gray-500 mb-10">
        {new Date(post.created_at).toLocaleDateString()}
      </div>

      <div className="prose">
        {post.content}
      </div>
    </div>
  )
}