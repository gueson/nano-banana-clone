import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Editor } from "@/components/editor"
import { Features } from "@/components/features"
import { Showcase } from "@/components/showcase"
import { FAQ } from "@/components/faq"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Editor />
      <Features />
      <Showcase />
      <FAQ />
      <Footer />
    </main>
  )
}
