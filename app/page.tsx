import { Metadata } from "next"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Editor } from "@/components/editor"
import { Features } from "@/components/features"
import { Showcase } from "@/components/showcase"
import { FAQ } from "@/components/faq"
import { Footer } from "@/components/footer"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Nano Banana - AI Image Editor | Transform Photos with Text",
  description: "Transform any image with simple text prompts. Advanced AI model for consistent character editing and scene preservation.",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  },
}

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
      
      {/* FAQ Schema - JSON-LD */}
      <Script id="faq-schema" strategy="afterInteractive">
        {`
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is Nano Banana?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Nano Banana is an AI image editor that transforms photos using natural language prompts. Upload an image, describe the edit you want, and the app generates an updated version."
                }
              },
              {
                "@type": "Question",
                "name": "How does it work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Upload an image and describe your desired edits in natural language. The app processes the prompt and generates edited images that you can download or iterate on."
                }
              },
              {
                "@type": "Question",
                "name": "What kinds of edits work well?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Common workflows include background changes, object placement, style transfers, and adjustments while trying to preserve the overall look of the original image."
                }
              },
              {
                "@type": "Question",
                "name": "Can I use it for commercial projects?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Depending on your plan, commercial use may be available. Review the plan details on the Pricing page and the Terms of Service for the latest usage terms."
                }
              },
              {
                "@type": "Question",
                "name": "What types of edits can it handle?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "It supports a range of edits including face completion, background changes, object placement, style transfers, and character modifications. Results can vary depending on the input image and prompt."
                }
              },
              {
                "@type": "Question",
                "name": "Where can I try Nano Banana?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "You can try Nano Banana through our web interface. Upload your image, enter a text prompt describing your desired edits, and review the generated results."
                }
              }
            ]
          }
        `}
      </Script>
    </main>
  )
}
