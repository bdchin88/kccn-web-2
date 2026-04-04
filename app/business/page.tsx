import Header from "@/components/header"
import Business from "@/components/business"
import CoreValues from "@/components/core-values"
import Footer from "@/components/footer"

export default function BusinessPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* 이제 FullBackground는 여기서 빠지고 Hero 컴포넌트 내부에서만 작동합니다. */}
      <Header />
      <Business />
      <CoreValues />
      <Footer />
    </main>
  )
}
