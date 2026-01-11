"use client"

import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Hero() {
  const goTo = (sectionId: string) => {
    const target = document.getElementById(sectionId)
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
      window.history.replaceState(null, "", `/#${sectionId}`)
      return
    }

    window.location.href = `/#${sectionId}`
  }

  return (
    <section className="relative overflow-hidden border-b border-border bg-background py-20 md:py-32">
      {/* Decorative bananas */}
      <div className="absolute top-10 right-10 text-6xl opacity-20 rotate-12 hidden lg:block">🍌</div>
      <div className="absolute bottom-20 left-10 text-8xl opacity-10 -rotate-12 hidden lg:block">🍌</div>
      <div className="absolute top-1/2 left-1/4 text-4xl opacity-10 rotate-45 hidden lg:block">🍌</div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium">
            <span className="text-xl">🍌</span>
            <span>The AI model that outperforms Flux Kontext</span>
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl text-balance">Nano Banana</h1>

          <p className="mb-8 text-lg md:text-xl text-muted-foreground text-pretty leading-relaxed max-w-3xl mx-auto">
            Transform any image with simple text prompts. Nano-banana&apos;s advanced model delivers consistent
            character editing and scene preservation that surpasses Flux Kontext. Experience the future of AI image
            editing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8"
              onClick={() => goTo("editor")}
            >
              Start Editing
              <span className="ml-2 text-xl">🍌</span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 bg-transparent"
              onClick={() => goTo("showcase")}
            >
              View Examples
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap gap-6 justify-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-accent">✓</span> One-shot editing
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent">✓</span> Multi-image support
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent">✓</span> Natural language
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
