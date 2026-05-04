"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { checkAdminLock, recordFailAttempt, resetAuthAttempts } from "@/lib/auth";

export default function DeleteButton({ postId }: { postId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // 모달 표시 여부
  const [password, setPassword] = useState(""); // 입력 비밀번호

  // 삭제 프로세스 시작
  const openDeleteModal = () => {
    const lockStatus = checkAdminLock();
    if (lockStatus.isLocked) {
      alert(`보안을 위해 접속이 제한되었습니다. ${lockStatus.remaining}초 후 다시 시도하세요.`);
      return;
    }
    setShowModal(true);
  };

  const handleAuthAndDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. 비밀번호 확인 (환경변수와 비교)
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      if (confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
        setLoading(true);
        resetAuthAttempts(); // 성공 시 초기화

        const { error } = await supabase.from("posts").delete().eq("id", postId);
        
        if (error) {
          alert("삭제 중 오류가 발생했습니다.");
          setLoading(false);
        } else {
          alert("삭제되었습니다.");
          setShowModal(false);
          router.push("/notice");
        }
      }
    } else {
      // 2. 실패 시 횟수 카운트 및 잠금 설정
      const isLockedNow = recordFailAttempt();
      if (isLockedNow) {
        alert("비밀번호 5회 오류로 인해 1분간 삭제 시도가 제한됩니다.");
        setShowModal(false);
      } else {
        const attempts = localStorage.getItem("admin_pw_attempts");
        alert(`비밀번호가 틀립니다. (현재 ${attempts}/5회 오류)`);
      }
      setPassword("");
    }
  };

  return (
    <>
      {/* 📌 예쁘게 디자인된 삭제 버튼 */}
      <button
        onClick={openDeleteModal}
        disabled={loading}
        className="px-4 py-1.5 bg-red-50 text-red-500 text-xs font-bold rounded-full border border-red-100 hover:bg-red-500 hover:text-white hover:shadow-md transition-all duration-200"
      >
        {loading ? "삭제 중..." : "게시글 삭제"}
      </button>

      {/* 📌 비밀번호 입력 커스텀 모달 (비밀번호 마스킹 가능) */}
       {/* <div className="fixed inset-0 z-[100] flex items-center(수직중앙 정렬) 를 items-start 로, pt-32: padding-top */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-start pt-40 justify-center bg-black/50 backdrop-blur-sm p-4">
          <form 
            onSubmit={handleAuthAndDelete}
            className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-100 animate-in fade-in zoom-in duration-200"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-2">관리자 인증</h3>
            <p className="text-sm text-slate-500 mb-6">삭제를 위해 비밀번호를 입력해주세요.</p>
            
            <input
              type="password" // ◀ 여기서 "******" 처리가 됩니다.
              autoFocus
              required
              placeholder="비밀번호 입력"
              className="w-full p-3 border border-slate-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setShowModal(false); setPassword(""); }}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-200 transition-colors"
              >
                확인
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}