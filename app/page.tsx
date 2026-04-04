import Header from "@/components/header"
import Hero from "@/components/hero"
import Placard from "@/components/placard";
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* 이제 FullBackground는 여기서 빠지고 Hero 컴포넌트 내부에서만 작동합니다. */}
      <Header />
      <Hero />
      <Placard />
      <Footer />
    </main>
  )
}
