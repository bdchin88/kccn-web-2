"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function VisitorLogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchLogs = async () => {
      // 데이터가 있는(created_at이 있는) 로그만 가져오기
      const { data } = await supabase
        .from("yesterday_visitor_logs")
        .select("*")
        .not("created_at", "is", null)
        .order("created_at", { ascending: false });
      
      setLogs(data || []);
    };
    fetchLogs();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">전일 방문자 상세 로그 (최근 50명)</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 font-bold">
            <tr>
              <th className="p-4">시간</th>
              <th className="p-4">IP</th>
              <th className="p-4">기기</th>
              <th className="p-4">지역</th>
              <th className="p-4">유입경로</th>
              <th className="p-4">방문페이지</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="p-4 text-xs">{new Date(log.created_at).toLocaleString()}</td>
                <td className="p-4">{log.ip}</td>
                <td className="p-4">{log.device}</td>
                <td className="p-4 text-xs">{log.region}</td>
                <td className="p-4 truncate max-w-[150px]">{log.referrer}</td>
                <td className="p-4">{log.page_path}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button 
        onClick={() => router.back()}
        className="mt-8 bg-slate-800 text-white px-6 py-2 rounded-lg font-bold"
      >
        확인 (돌아가기)
      </button>
    </div>
  );
}