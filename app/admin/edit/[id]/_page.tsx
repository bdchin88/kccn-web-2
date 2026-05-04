// app/admin/edit/[id]/page.tsx
"use client";

import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("notice");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase.from("posts").select("*").eq("id", id).single();
      if (data) {
        setTitle(data.title);
        setContent(data.content);
        setType(data.type);
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from("posts")
      .update({ title, content, type })
      .eq("id", id);

    if (error) alert("수정 실패");
    else {
      alert("수정되었습니다.");
      router.push("/admin/list");
    }
  };

  if (loading) return <div className="p-10 text-center">불러오는 중...</div>;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">게시글 수정</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input 
          className="w-full p-3 border rounded" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="제목"
        />
        <textarea 
          className="w-full p-3 border rounded h-64" 
          value={content} 
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="w-full bg-[#0047AB] text-white py-3 rounded font-bold">
          수정 완료
        </button>
      </form>
    </div>
  );
}