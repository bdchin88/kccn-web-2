import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const { password, postId } = await req.json();

    // 관리자 비밀번호 확인
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "비밀번호가 일치하지 않습니다." },
        { status: 401 }
      );
    }

    // 게시글 조회
    const { data: post, error: postError } = await supabaseAdmin
      .from("posts")
      .select("file_path, content")
      .eq("id", postId)
      .single();

    if (postError || !post) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 첨부파일 삭제
    if (post.file_path) {
      await supabaseAdmin.storage
        .from("resources")
        .remove([post.file_path]);
    }

    // 본문 이미지 삭제
    if (post.content) {

      const regex =
        /storage\/v1\/object\/public\/issue_images\/([^"]+)/g;

      const imagePaths: string[] = [];

      let match;

      while ((match = regex.exec(post.content)) !== null) {
        imagePaths.push(match[1]);
      }

      if (imagePaths.length > 0) {
        await supabaseAdmin.storage
          .from("issue_images")
          .remove(imagePaths);
      }
    }

    // 게시글 삭제
    const { error: deleteError } = await supabaseAdmin
      .from("posts")
      .delete()
      .eq("id", postId);

    if (deleteError) {
      return NextResponse.json(
        { error: "삭제 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });

    } catch (err: any) {
    console.error("DELETE API ERROR:", err);

    return NextResponse.json(
        {
        error: err.message,
        },
        {
        status: 500,
        }
    );
    }
}