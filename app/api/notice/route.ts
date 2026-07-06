// app/api/notice/route.ts 
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  const { data } = await supabase
    .from("posts")
    .select("*")  //가능하면 ".select("id,title,created_at")" 처럼 필요한 컬럼만 반환하는 것이 좋습니다.
    .eq("type", "notice")
    .order("created_at", { ascending: false })
    .limit(5)

  return NextResponse.json(data)
}