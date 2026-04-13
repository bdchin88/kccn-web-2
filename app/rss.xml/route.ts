// app/rss.xml/route.ts
import { supabase } from "@/lib/supabase";

export async function GET() {
  const SITE_URL = "https://www.kccn.or.kr";

  // 1. Supabase에서 최신 공지사항 가져오기
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  // 2. RSS XML 생성
  const itemsXml = posts
    ?.map((post) => `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${SITE_URL}/notice/${post.id}</link>
        <description><![CDATA[${post.content?.slice(0, 200)}...]]></description>
        <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
        <guid>${SITE_URL}/notice/${post.id}</guid>
      </item>
    `)
    .join("");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>한국신용카드네트워크</title>
        <link>${SITE_URL}</link>
        <description>한국신용카드네트워크의 최신 소식을 전해드립니다.</description>
        <language>ko</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
        ${itemsXml}
      </channel>
    </rss>`;

  // 3. XML 헤더와 함께 응답
  return new Response(rssXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=1200, stale-while-revalidate=600",
    },
  });
}