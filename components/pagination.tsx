// components/pagination.tsx (클라이언트 또는 서버 컴포넌트) 
import Link from "next/link";

export default function Pagination({ currentPage, totalPages, currentType }: any) {
  // 표시할 페이지 번호 배열 생성 (예: [1, 2, 3...])
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center space-x-2 mt-12 pb-10">
      {/* 이전 페이지 버튼 */}
      {currentPage > 1 && (
        <Link
          href={`/notice?type=${currentType}&page=${currentPage - 1}`}
          className="px-3 py-2 border rounded hover:bg-gray-50"
        >
          이전
        </Link>
      )}

      {/* 페이지 번호 */}
      {pages.map((p) => (
        <Link
          key={p}
          href={`/notice?type=${currentType}&page=${p}`}
          className={`px-4 py-2 border rounded transition-colors ${
            p === currentPage
              ? "bg-[#0047AB] text-white border-[#0047AB]"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          {p}
        </Link>
      ))}

      {/* 다음 페이지 버튼 */}
      {currentPage < totalPages && (
        <Link
          href={`/notice?type=${currentType}&page=${currentPage + 1}`}
          className="px-3 py-2 border rounded hover:bg-gray-50"
        >
          다음
        </Link>
      )}
    </div>
  );
}