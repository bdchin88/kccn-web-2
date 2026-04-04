import Header from "@/components/header"
import Hero from "@/components/hero"
import Services from "@/components/services"
import Business from "@/components/business"
import CoreValues from "@/components/core-values"
import About from "@/components/about"
import AboutHist from "@/components/abouthist"
import AboutCI from "@/components/aboutci" 
import About1 from "@/components/about1" 
import Footer from "@/components/footer"
import Link from "next/link"

export default function AboutCIPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* 이제 FullBackground는 여기서 빠지고 Hero 컴포넌트 내부에서만 작동합니다. */}
      <Header />
      <AboutCI />
      <Footer />
    </main>
  )
}
