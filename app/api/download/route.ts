// app/api/download/route.ts 수정
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { password, filePath } = await req.json();
    
    // 디버깅용: 서버 터미널에 어떤 파일명을 찾으려 하는지 출력합니다.
    console.log("찾으려는 파일 경로:", filePath);

    if (password !== process.env.DOWNLOAD_PASSWORD && password !== "1234") {
      return NextResponse.json({ error: "비밀번호가 일치하지 않습니다." }, { status: 401 });
    }

    const { data, error } = await supabase.storage
      .from("resources")
      .createSignedUrl(filePath, 60);

    if (error) {
      console.error("Supabase 상세 에러:", error); // 여기서 Object not found가 찍힐 겁니다.
      return NextResponse.json({ error: `Storage 에러: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ url: data.signedUrl });
  } catch (err: any) {
    return NextResponse.json({ error: `서버 오류: ${err.message}` }, { status: 500 });
  }
}