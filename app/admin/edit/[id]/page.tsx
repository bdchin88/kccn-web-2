// app/admin/edit/[id]/page.tsx 
"use client";

import { useState, useEffect, use, useRef } from "react"; // 💡 본문 커서 위치 조작을 위한 useRef 추가
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null); // 💡 본문 커서 제어를 위한 Ref 선언

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("notice");
  // 💡 추가된 필드 상태 관리
  const [location, setLocation] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [filePath, setFilePath] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false); // 💡 본문 이미지 업로드 상태관리 추가

  useEffect(() => {
    const fetchPost = async () => {
      // 모든 필드 데이터를 가져오도록 설정
      const { data } = await supabase.from("posts").select("*").eq("id", id).single();
      if (data) {
        setTitle(data.title);
        setContent(data.content);
        setType(data.type);
        // 💡 DB에서 가져온 값을 상태에 저장 (오류 유발하던 이스케이프 문자 \ 수정 완료)
        setLocation(data.location || "");
        setExpiryDate(data.expiry_date ? data.expiry_date.split('T')[0] : ""); // 날짜 포맷팅 (YYYY-MM-DD)
        setFilePath(data.file_path || "");
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  // 💡 [방식 A 핵심] 본문 수정 중 중간에 이미지 추가 핸들러
  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files?.[0];
    if (!imgFile) return;

    try {
      setUploadingImage(true);

      // 파일명 중복을 방지하기 위한 타임스탬프 기반 고유 난수 적용
      const fileExt = imgFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
      const storagePath = `content_images/${fileName}`;

      // 1. Supabase Storage 'issue_images' 버킷에 업로드
      const { error: uploadError } = await supabase.storage
        .from("issue_images")
        .upload(storagePath, imgFile);

      if (uploadError) throw uploadError;

      // 2. 업로드 완료된 이미지의 퍼블릭 주소 획득
      const { data: { publicUrl } } = supabase.storage
        .from("issue_images")
        .getPublicUrl(storagePath);

      // 3. 현재 텍스트 영역(textarea)의 마우스 커서 위치에 HTML 구조 태그 삽입
      const imgTag = `\n<img src="${publicUrl}" alt="image" style="max-w-full; height:auto; margin:16px 0; border-radius:12px;" />\n`;
      
      const textarea = textareaRef.current;
      if (textarea) {
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        const textBefore = content.substring(0, startPos);
        const textAfter = content.substring(endPos, content.length);

        // 이전 글 내용 + 이미지 태그 + 이후 글 내용 조립
        setContent(textBefore + imgTag + textAfter);
        
        // 포커스 유지 및 커서 위치를 삽입된 이미지 코드 바로 뒤로 정렬
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(startPos + imgTag.length, startPos + imgTag.length);
        }, 50);
      } else {
        // 예외 대응: 커서가 없는 상태면 맨 끝에 누적
        setContent((prev) => prev + imgTag);
      }

      alert("이미지가 본문에 성공적으로 삽입되었습니다.");
    } catch (error: any) {
      alert("이미지 업로드 실패: " + error.message);
    } finally {
      setUploadingImage(false);
      e.target.value = ""; // 초기화하여 동일 파일 재선택 허용
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    // 💡 저장 시 기존 구조와 추가 필드 데이터를 통합 매핑 처리
    const { error } = await supabase
      .from("posts")
      .update({ 
        title, 
        content, 
        type,
        location: type === "notice" ? location : "",
        expiry_date: type === "notice" && expiryDate ? expiryDate : null,
        file_path: type === "archive" ? filePath : ""
      })
      .eq("id", id);

    if (error) alert("수정 실패");
    else {
      alert("수정되었습니다.");
      router.push("/admin/list");
    }
  };

  if (loading) return <div className="p-10 text-center">불러오는 중...</div>;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">게시글 수정</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input 
          className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-semibold" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="제목"
        />

        <div className="flex gap-4 mb-4">
          {[
            { value: "notice", label: "공지" },
            { value: "issue", label: "정보" },
            { value: "archive", label: "자료" }
          ].map((item) => (
            <label key={item.value} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="type"
                value={item.value}
                checked={type === item.value} 
                onChange={(e) => setType(e.target.value)}
                className="w-4 h-4 accent-[#0047AB]"
              />
              <span className="text-sm font-semibold text-slate-700">{item.label}</span>
            </label>
          ))}
        </div>

        {/* 💡 [추가 필드 레이아웃] 공지사항 전용 (장소/일시, 종료일) */}
        {type === "notice" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 ml-1">장소 및 일시</label>
              <input 
                className="w-full p-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                placeholder="장소 및 일시 입력"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 ml-1">게시 종료일</label>
              <input 
                type="date"
                className="w-full p-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" 
                value={expiryDate} 
                onChange={(e) => setExpiryDate(e.target.value)} 
              />
            </div>
          </div>
        )}

        {/* 💡 [추가 필드 레이아웃] 자료실 전용 */}
        {type === "archive" && (
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 ml-1">첨부파일 경로 (File Path)</label>
            <input 
              className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 text-sm focus:outline-none" 
              value={filePath} 
              onChange={(e) => setFilePath(e.target.value)} 
              placeholder="파일 경로"
            />
            <p className="text-[10px] text-slate-400 mt-2 ml-1">* 파일명 수정 시 실제 스토리지의 파일명과 일치해야 합니다.</p>
          </div>
        )}

        {/* 💡 [신규 추가] 이슈와 정보 탭 선택 시 활성화되는 인라인 이미지 컴포넌트 바 */}
        {type === "issue" && (
          <div className="p-4 bg-slate-50 border rounded-xl flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">본문 수정 중 이미지를 원하는 커서 자리에 추가하세요:</span>
            <div className="flex items-center gap-2">
              <input 
                type="file" 
                accept="image/*" 
                id="edit-inline-upload" 
                className="hidden" 
                onChange={handleInlineImageUpload}
                disabled={uploadingImage}
              />
              <label 
                htmlFor="edit-inline-upload"
                /* 💡 버튼 전체 가독성을 위해 text-xs -> text-sm으로 변경, 간격 및 정렬 보정 */
                className="bg-white border border-slate-200 text-xs font-bold text-slate-700 px-5 py-2.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shadow-sm flex items-center gap-2 group active:scale-95 transition-all"
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
                    <span className="leading-none">이미지 추가 삽입</span>
                  </>
                )}
              </label>
            </div>
          </div>
        )}

        <textarea 
          ref={textareaRef} // 💡 커서 추적 바인딩
          className="w-full p-4 border border-slate-200 rounded-xl h-80 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none font-mono text-sm leading-relaxed" 
          value={content} 
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요. 이미지가 포함된 글의 경우 HTML 태그 형태로 노출되며 편집할 수 있습니다."
        />

        <div className="flex gap-4">
          <button 
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all active:scale-95"
          >
            취소
          </button>
          <button 
            type="submit"
            disabled={uploadingImage}
            className="flex-1 bg-[#0047AB] text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95 disabled:bg-slate-400"
          >
            수정하기
          </button>
        </div>
      </form>
    </div>
  );
}