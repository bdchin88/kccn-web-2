// app/api/download/route.ts 수정
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { password, filePath } = await req.json();
    
    // 디버깅용: 서버 터미널에 어떤 파일명을 찾으려 하는지 출력합니다.
    // 운영 환경에서는 불필요한 로그는 제거하거나 디버그 모드에서만 출력, 운영모드에서 삭제 요
    console.log("찾으려는 파일 경로:", filePath);
    {/* if (password !== process.env.DOWNLOAD_PASSWORD && password !== "1234") {  //백도어 비번  */}
    if (password !== process.env.DOWNLOAD_PASSWORD) {
      return NextResponse.json(
        { error: "비밀번호가 일치하지 않습니다." }, 
        { status: 401 });
    }

    // filePath가 문자열인지 확인
    if (typeof filePath !== "string") {
      return NextResponse.json(
        { error: "잘못된 요청입니다." },
        { status: 400 }
      );
    }

    const fileName = filePath.trim();
    // 빈 문자열
    if (fileName === "") {
      return NextResponse.json(
        { error: "잘못된 요청입니다." },
        { status: 400 }
      );
    }

    // 경로 문자 차단, 경로 조작 방지
    if (
      filePath.includes("/") ||
      filePath.includes("\\") ||
      filePath.includes("..")
    ) {
      return NextResponse.json(
        { error: "잘못된 요청입니다." },
        { status: 403 }
      );
    }

    // 허용 확장자
    const allowedExtensions = [".pdf", ".hwp", ".hwpx", ".doc", ".docx", ".jpg", ".png"];

    if (!allowedExtensions.some(ext =>
      fileName.toLowerCase().endsWith(ext)
    )) {
      return NextResponse.json(
        { error: "허용되지 않는 파일 형식입니다." },
        { status: 403 }
      );
    }    

    // ③ 정상인 경우에만 Signed URL 생성, 여기서 createSignedUrl()
    const { data, error } = await supabase.storage
      .from("resources")
      .createSignedUrl(filePath, 60);

    if (error) {
      {/* console.error("Supabase 상세 에러:", error); // 여기서 Object not found가 찍힐 겁니다.
       return NextResponse.json({ error: `Storage 에러: ${error.message}` }, { status: 500 });  
        "Object not found" "Bucket ..." 같은 내부 정보를 그대로 사용자에게 보여주지 않는 것이 좋습니다. */}
      return NextResponse.json(
        { error: "파일을 찾을 수 없습니다." }, 
        { status: 500 });
    }

    return NextResponse.json({
      signedUrl: data.signedUrl,
    });
  } catch (err: any) {
    return NextResponse.json({ error: `서버 오류: ${err.message}` }, { status: 500 });
  }
}