import { createClient } from '@/lib/supabase/server';
import { PostCard } from '@/components/post-card';

export default async function NoticePage() {
  const supabase = await createClient();
  
  // Supabase에서 공지사항 데이터 가져오기
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="p-20 text-center text-red-500 font-bold">
        데이터 로드 실패: {error.message}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-slate-800">공지사항</h1>
        <p className="text-slate-500 text-sm">전체 {posts?.length || 0}건</p>
      </div>

      <div className="grid gap-6">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        {(!posts || posts.length === 0) && (
          <div className="text-center py-24 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">등록된 공지사항이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}