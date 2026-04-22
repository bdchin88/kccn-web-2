"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function VisitorLogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase
        .from("yesterday_visitor_logs")
        .select("*")
        .not("created_at", "is", null)
        .order("created_at", { ascending: false });
      
      setLogs(data || []);
    };
    fetchLogs();
  }, []);

  // 요일별 배경색 결정 함수
  const getRowBgColor = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일

    switch (day) {
      case 0: return "bg-red-50";     // 일요일: 연한 적색
      case 1: return "bg-orange-50";  // 월요일
      case 2: return "bg-yellow-50";  // 화요일
      case 3: return "bg-green-50";   // 수요일
      case 4: return "bg-blue-50";    // 목요일
      case 5: return "bg-indigo-50";  // 금요일
      case 6: return "bg-slate-50";   // 토요일
      default: return "bg-white";
    }
  };

  // 요일 텍스트 추출 함수
  const getDayName = (dateString: string) => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return days[new Date(dateString).getDay()];
  };

return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          전일 방문자 상세 로그 <span className="text-sm font-normal text-slate-500">(최근 50명)</span>
        </h1>
        {/* 요일 가이드 (모바일에서는 숨김 처리하여 공간 확보) */}
        <div className="hidden sm:flex gap-2">
           <span className="flex items-center gap-1 text-xs"><div className="w-3 h-3 bg-red-50 border border-red-100"></div> 일요일</span>
           <span className="text-xs text-slate-400">|</span>
           <span className="text-xs text-slate-500">요일별 색상 구분</span>
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
        {/* ▽ 이 부분에 overflow-x-auto를 추가하여 드래그 기능을 활성화합니다 ▽ */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left border-collapse min-w-[800px]"> 
            {/* min-w-[800px]를 주어 모바일에서도 테이블 형태가 깨지지 않고 유지되게 합니다 */}
            <thead className="bg-slate-800 text-white font-bold">
              <tr>
                <th className="p-4 whitespace-nowrap">방문 시간 (요일)</th>
                <th className="p-4 whitespace-nowrap">IP 주소</th>
                <th className="p-4 whitespace-nowrap">기기</th>
                <th className="p-4 whitespace-nowrap">지역</th>
                <th className="p-4 whitespace-nowrap">유입경로</th>
                <th className="p-4 whitespace-nowrap">방문페이지</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {logs.map((log) => {
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
                    <td className="p-4">
                      <div className="truncate max-w-[200px] text-xs text-slate-500" title={log.referrer}>
                        {log.referrer}
                      </div>
                    </td>
                    <td className="p-4 text-xs font-medium text-[#0047AB] whitespace-nowrap">
                      {log.page_path}
                    </td>
                  </tr>
                );
              })}
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