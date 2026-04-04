import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-serif text-3xl font-normal tracking-tight md:text-4xl lg:text-5xl">
          Ready to start your project?
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
          {"Let's"} work together to create something exceptional. Get in touch with us today.
        </p>
        <div className="mt-10">
          <Button size="lg" className="rounded-full px-10">
            Get in Touch
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
