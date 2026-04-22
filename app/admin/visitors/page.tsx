"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function VisitorLogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [postTitles, setPostTitles] = useState<{ [key: string]: string }>({}); // ID별 제목 저장
  const router = useRouter();

  useEffect(() => {
    const fetchLogsAndTitles = async () => {
      // 1. 로그 데이터 가져오기
      const { data: logData } = await supabase
        .from("yesterday_visitor_logs")
        .select("*")
        .not("created_at", "is", null)
        .order("created_at", { ascending: false });
      
      const visitorLogs = logData || [];
      setLogs(visitorLogs);

      // 2. /notice/id 형태의 경로에서 UUID 추출
      const noticeIds = visitorLogs
        .map(log => {
          const match = log.page_path?.match(/\/notice\/([0-9a-fA-F-]{36})/);
          return match ? match[1] : null;
        })
        .filter(Boolean) as string[];

      // 3. 추출된 ID가 있다면 중복 제거 후 제목 가져오기
      if (noticeIds.length > 0) {
        const uniqueIds = Array.from(new Set(noticeIds));
        const { data: postData } = await supabase
          .from("posts")
          .select("id, title")
          .in("id", uniqueIds);

        if (postData) {
          const titleMap = postData.reduce((acc, post) => {
            acc[post.id] = post.title;
            return acc;
          }, {} as { [key: string]: string });
          setPostTitles(titleMap);
        }
      }
    };

    fetchLogsAndTitles();
  }, []);

  // 페이지 경로를 변환하는 함수
  const formatPagePath = (path: string) => {
    const match = path.match(/\/notice\/([0-9a-fA-F-]{36})/);
    if (match) {
      const id = match[1];
      const title = postTitles[id];
      return title ? `/notice/${title}` : path; // 제목이 있으면 교체, 없으면 기존 경로
    }
    return path;
  };

  // 요일별 배경색 (기존 로직 유지)
  const getRowBgColor = (dateString: string) => {
    const day = new Date(dateString).getDay();
    const colors = ["bg-red-50", "bg-orange-50", "bg-yellow-50", "bg-green-50", "bg-blue-50", "bg-indigo-50", "bg-slate-50"];
    return colors[day] || "bg-white";
  };

  const getDayName = (dateString: string) => {
    return ["일", "월", "화", "수", "목", "금", "토"][new Date(dateString).getDay()];
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          전일 방문자 상세 로그 <span className="text-sm font-normal text-slate-500">(최근 50명)</span>
        </h1>
        {/* 요일 가이드 (모바일 가독성을 위해 sm 이상에서만 노출) */}
        <div className="hidden sm:flex gap-2">
           <span className="flex items-center gap-1 text-xs"><div className="w-3 h-3 bg-red-50 border border-red-100"></div> 일요일</span>
           <span className="text-xs text-slate-400">|</span>
           <span className="text-xs text-slate-500">요일별 색상 구분 적용됨</span>
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
        {/* 모바일에서 방문페이지까지 드래그해서 볼 수 있도록 overflow-x-auto 추가 */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[850px]">
            <thead className="bg-slate-800 text-white font-bold">
              <tr>
                <th className="p-4 whitespace-nowrap">방문 시간 (요일)</th>
                <th className="p-4">IP 주소</th>
                <th className="p-4">기기</th>
                <th className="p-4">지역</th>
                <th className="p-4">유입경로</th>
                <th className="p-4">방문페이지</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-20 text-center text-slate-400">기록된 로그가 없습니다.</td>
                </tr>
              ) : (
                logs.map((log) => {
                  const rowColor = getRowBgColor(log.created_at);
                  const dayName = getDayName(log.created_at);
                  
                  return (
                    <tr key={log.id} className={`${rowColor} hover:brightness-95 transition-all`}>
                      <td className="p-4 whitespace-nowrap font-medium">
                        {new Date(log.created_at).toLocaleString()} 
                        <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] ${dayName === '일' ? 'bg-red-200 text-red-700' : 'bg-slate-200 text-slate-600'}`}>
                          {dayName}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-xs text-slate-600 whitespace-nowrap">{log.ip}</td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${log.device === 'Mobile' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                          {log.device}
                        </span>
                      </td>

                      <td className="p-4 text-xs text-slate-500 whitespace-nowrap">{log.region}</td> 
                      {/*<td className="p-4">
                        {/* truncate와 max-w를 제거하고 whitespace-nowrap을 추가합니다 */}
                      {/*  <div className="text-xs text-slate-500 whitespace-nowrap" title={log.referrer}>  */}
                      {/*    {log.referrer}  */}
                      {/*  </div>  */}
                      {/*</td> */}

                      <td className="p-4">
                        <div className="truncate max-w-[150px] text-xs text-slate-500" title={log.referrer}>
                          {log.referrer}
                        </div>
                      </td>
                      <td className="p-4 text-xs font-bold text-[#0047AB] whitespace-nowrap">
                        {/* 기존 log.page_path 대신 제목 변환 함수 적용 */}
                        {formatPagePath(log.page_path)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button 
          onClick={() => router.back()}
          className="bg-slate-800 text-white px-10 py-3 rounded-xl font-bold hover:bg-slate-700 shadow-lg transition-all active:scale-95"
        >
          확인 (돌아가기)
        </button>
      </div>
    </div>
  );
}  