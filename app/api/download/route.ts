import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { password, filePath } = await req.json()

  // 1️⃣ 비밀번호 체크 (환경변수 or DB)
  if (password !== process.env.DOWNLOAD_PASSWORD) {
    return NextResponse.json({ error: "비밀번호 틀림" }, { status: 401 })
  }

  // 2️⃣ Supabase signed URL 생성
  const { data } = await supabase.storage
    .from("resources")
    .createSignedUrl(filePath, 60) // 60초 유효

  return NextResponse.json({ url: data?.signedUrl })
}