import { NextResponse } from "next/server";

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>한국신용카드네트워크</title>
  <link>https://www.kccn.or.kr</link>
  <description>KCCN 공지사항</description>
  <language>ko</language>

  <item>
    <title>한국신용카드네트워크 홈페이지 오픈</title>
    <link>https://www.kccn.or.kr/notice</link>
    <description>공식 홈페이지가 오픈되었습니다.</description>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <guid>https://www.kccn.or.kr/notice</guid>
  </item>

</channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=UTF-8",
    },
  });
}
