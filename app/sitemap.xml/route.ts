// app/sitemap.xml/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // 설정된 supabase 클라이언트 경로 확인

export async function GET() {
  const base = "https://www.kccn.or.kr";

  // 1. Supabase에서 모든 게시글 ID와 날짜 가져오기 (검색 노출을 위해 필수)
  const { data: posts } = await supabase
    .from("posts")
    .select("id, created_at")
    .order("created_at", { ascending: false });

  // 2. 게시글 상세 페이지 URL 생성
  const postUrls = posts?.map((post) => `
  <url>
    <loc>${base}/notice/${post.id}</loc>
    <lastmod>${new Date(post.created_at).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join("") || "";

  // 3. 전체 XML 구조 생성
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${base}/about</loc>
    <lastmod>2024-03-27T00:00:00Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${base}/services</loc>
    <lastmod>2024-03-27T00:00:00Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${base}/notice</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${base}/business</loc>
    <lastmod>2024-03-27T00:00:00Z</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${base}/ci</loc>
    <lastmod>2024-03-27T00:00:00Z</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>
  ${postUrls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=UTF-8",
      // 캐시 설정: 네이버가 올 때마다 최신 상태를 보여주도록 설정
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}