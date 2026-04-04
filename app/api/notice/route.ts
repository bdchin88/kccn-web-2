import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("type", "notice")
    .order("created_at", { ascending: false })
    .limit(5)

  return NextResponse.json(data)
}