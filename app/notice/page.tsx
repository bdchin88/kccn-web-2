import Header from "@/components/header"; 
import Footer from "@/components/footer";

export default function NoticePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center bg-yellow-200 py-20 text-center">
        <h1 className="text-5xl font-bold text-black mb-4">전체 파일 교체 성공</h1>
        <p className="text-xl text-slate-700">이제 GitHub와 VSC가 완전히 동기화되었습니다.</p>
      </main>
      <Footer />
    </div>
  );
}
// sync check: 2026-04-04