// app/admin/write/page.tsx 
"use client"; 

import { useState, useRef } from "react"; // 💡 커서 위치 추적을 위한 useRef 추가
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { checkAdminLock, recordFailAttempt, resetAuthAttempts } from "@/lib/auth"; // ◀ 보안 공통 함수 유지

export default function AdminWritePage() {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null); // 💡 본문 커서 위치 파악을 위한 Ref 복구
  
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  
  // 폼 상태 관리
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("notice");
  const [location, setLocation] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false); // 💡 이미지 업로드 전용 로딩 상태 복구

  // 1. 관리자 인증 (보안 로직 적용)
  // 1. 관리자 인증 (API 방식)
  const handleAuth = async () => {
    // 📌 잠금 상태 확인
    const lockStatus = checkAdminLock();
    if (lockStatus.isLocked) {
      alert(`보안상 이유로 인증이 제한되었습니다. ${lockStatus.remaining}초 후 다시 시도하세요.`);
      return;
    }

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const isLockedNow = recordFailAttempt();

        if (isLockedNow) {
          alert("비밀번호 5회 오류로 인해 1분간 인증 시도가 제한됩니다.");
        } else {
          const attempts = localStorage.getItem("admin_pw_attempts");
          alert(`비밀번호가 틀립니다. (현재 ${attempts}/5회 오류)`);
        }

        setPassword("");
        return;
      }

      // 인증 성공
      resetAuthAttempts();
      setIsAuthorized(true);

    } catch (err) {
      console.error(err);
      alert("서버 오류가 발생했습니다.");
    }
  };

  // 💡 [방식 A 복구] 본문 중간중간 이미지 삽입 핸들러
  const handleImageInsertion = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files?.[0];
    if (!imgFile) return;

    try {
      setUploadingImage(true);

      // 파일명 중복 방지 고유값 처리
      const fileExt = imgFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
      const storagePath = `content_images/${fileName}`;

      // 1. Supabase Storage 'issue_images' 버킷에 업로드
      const { error: uploadError } = await supabase.storage
        .from("issue_images")
        .upload(storagePath, imgFile);

      if (uploadError) throw uploadError;

      // 2. 업로드된 이미지의 Public URL 획득
      const { data: { publicUrl } } = supabase.storage
        .from("issue_images")
        .getPublicUrl(storagePath);

      // 3. 본문 textarea의 현재 커서 위치에 <img /> 태그 형태로 삽입
      const imgTag = `\n<img src="${publicUrl}" alt="image" style="max-w-full; height:auto; margin:16px 0; border-radius:12px;" />\n`;
      
      const textarea = textareaRef.current;
      if (textarea) {
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        const textBefore = content.substring(0, startPos);
        const textAfter = content.substring(endPos, content.length);

        // 커서 위치에 이미지 태그를 삽입한 새로운 본문 내용 반영
        setContent(textBefore + imgTag + textAfter);
        
        // 입력 칸 포커스 복구 및 커서 정렬
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(startPos + imgTag.length, startPos + imgTag.length);
        }, 50);
      } else {
        setContent((prev) => prev + imgTag);
      }

      alert("이미지가 본문에 성공적으로 삽입되었습니다.");
    } catch (error: any) {
      alert("이미지 업로드 중 오류 발생: " + error.message);
    } finally {
      setUploadingImage(false);
      e.target.value = ""; // 초기화
    }
  };

  // 2. 글 등록 로직
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return alert("제목과 내용을 입력해주세요.");

    setLoading(true);

    try {
      let filePath = "";
      
      // 자료실(archive)이면서 파일이 첨부된 경우 스토리지 업로드 수행
      if (type === "archive" && file) {
        const fileExt = file.name.split(".").pop();
        //const fileName = `${Date.now()}.${fileExt}`;
        const fileName = `${Date.now()}_${file.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from("resources")
          .upload(fileName, file);

        if (uploadError) throw uploadError;
        filePath = fileName;
      }

      // posts 테이블 인서트 연동
      const { error } = await supabase.from("posts").insert([
        {
          title,
          content,
          type,
          location: type === "notice" ? location : "",
          expiry_date: type === "notice" && expiryDate ? expiryDate : null,
          file_path: filePath,
          has_file: !!filePath,
        },
      ]);

      if (error) throw error;

      alert("글이 성공적으로 등록되었습니다.");
      router.push("/notice");
    } catch (err: any) {
      alert(`등록 실패: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 인증 화면 (틀 유지)
  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center py-20 min-h-screen bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
          <h1 className="text-xl font-bold text-center mb-2 text-slate-800">관리자 인증</h1>
          <p className="text-xs text-slate-400 text-center mb-6">글쓰기 권한을 확인하기 위해 패스워드를 입력하세요.</p>
          <input
            type="password"
            className="w-full p-4 border border-slate-200 rounded-xl mb-4 text-center focus:outline-none focus:ring-2 focus:ring-blue-100 font-mono"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAuth()}
          />
          <button
            onClick={handleAuth}
            className="w-full bg-[#0047AB] text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md"
          >
            인증하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-10 text-slate-900 border-b pb-4">새 게시글 등록</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-slate-700">게시판 구분</label>
            <select
              className="w-full p-3 border rounded-lg bg-white"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="notice">공지사항</option>
              <option value="issue">이슈와 정보</option>
              <option value="archive">자료실</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2 text-slate-700">제목</label>
            <input
              required
              className="w-full p-3 border rounded-lg font-semibold text-slate-800"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="게시글 제목을 입력하세요"
            />
          </div>
        </div>

        {/* 하위 확장 필드 그룹 */}
        <div className="transition-all duration-300">
          {/* 공지사항 옵션 (Notice 전용) */}
          {type === "notice" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">장소 및 일시 (선택)</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg"
                  placeholder="예: 협회 대회의실, 2026년5월1일, 14:00"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">메인 게시 종료일 (선택)</label>
                <input
                  type="datetime-local"
                  className="w-full p-3 border rounded-lg text-slate-600"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* 파일 업로드 (Archive 전용) */}
          {type === "archive" && (
            <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 animate-in fade-in duration-200">
              <label className="block text-sm font-bold mb-3 text-slate-700">첨부파일 (영문파일명 권장)</label>
              <input
                type="file"
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
          )}
        </div>

        {/* 💡 [복구 완료] 이슈와 정보 탭일 때 본문 상단에 '이미지 삽입' 바 노출 */}
        {type === "issue" && (
          <div className="p-4 bg-slate-50 border rounded-xl flex items-center justify-between animate-in fade-in duration-200">
            <span className="text-xs font-semibold text-slate-600">글 중간에 들어갈 이미지를 첨부하세요 (첨부이미지는 영문파일명 권장) :</span>
            <div className="flex items-center gap-3">
              <input 
                type="file" 
                accept="image/*" 
                id="inline-image-upload" 
                className="hidden" 
                onChange={handleImageInsertion}
                disabled={uploadingImage}
              />
              <label 
                htmlFor="inline-image-upload"
                className="bg-white border border-slate-200 text-xs font-bold text-slate-700 px-4 py-2.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shadow-sm active:scale-95 inline-block"
              >
                {uploadingImage ? (
                  "삽입 중..."
                ) : (
                  // 💡 이미지 삽입 모드일 때 (키우려는 부분)
                  <>
                    {/* 📷 이모지를 span으로 감싸고 text-xl 클래스 적용, 미세 위치 조정 */}
                    <span className="text-2xl transform group-hover:scale-110 transition-transform -mt-0.5">
                      📷
                    </span>
                    {/* 이모지 옆 텍스트 */}
                    <span className="leading-none">&nbsp;이미지 추가 삽입</span>
                  </>
                )}
              </label>
            </div>
          </div>
        )}

        {/* 본문 입력 영역 */}
        <div>
          <label className="block text-sm font-bold mb-2 text-slate-700">내용</label>
          <textarea
            ref={textareaRef} // 💡 커서 추적 바인딩 복구
            required
            className="w-full p-4 border border-slate-200 rounded-xl h-80 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none font-mono text-sm leading-relaxed"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            /* 💡 동적 placeholder 매핑 유지 */
            placeholder={
              type === "issue"
                ? "내용을 입력하세요. 이미지를 삽입하면 해당 자리에 HTML 이미지 코드가 자동으로 채워집니다."
                : "내용을 입력하세요."
            }
          />
        </div>

        {/* 동작 제어 버튼 그룹 */}
        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-200 hover:bg-gray-200/50 transition-colors border border-slate-200 text-slate-600 p-4 rounded-xl font-bold hover:bg-slate-50 transition-colors active:scale-95"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="flex-2 bg-[#0047AB] text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:bg-slate-300 shadow-lg active:scale-95"
          >
            {loading ? "등록 중..." : "게시글 등록하기"}
          </button>
        </div>
      </form>
    </div>
  );
}