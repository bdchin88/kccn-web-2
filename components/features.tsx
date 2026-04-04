import { Layers, Palette, Zap } from "lucide-react"

const features = [
  {
    icon: Palette,
    title: "Creative Design",
    description: "Beautiful, custom designs that capture your brand essence and engage your audience effectively.",
  },
  {
    icon: Layers,
    title: "Structured Approach",
    description: "Organized methodology ensuring every project is delivered on time with exceptional quality.",
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    description: "Quick turnaround times without compromising on the quality and attention to detail.",
  },
]

export function Features() {
  return (
    <section className="bg-card px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-3xl font-normal tracking-tight md:text-4xl lg:text-5xl">
            What we offer
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Everything you need to build great products and experiences.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-border bg-background p-8 transition-all hover:border-foreground/20 hover:shadow-lg"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <feature.icon className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="mb-3 text-xl font-medium tracking-tight">{feature.title}</h3>
              <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
