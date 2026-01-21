import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Contact - Nano Banana AI Image Editor",
  description: "Get in touch with Nano Banana support for any questions or assistance with our AI image editor.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/contact`,
  },
}

export default function ContactPage() {
  const supportEmail =
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@lincy.online"

  return (
    <main className="min-h-screen">
      <Header />
      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Contact</h1>
        <p className="text-sm text-muted-foreground mb-8">
          For customer support and billing questions, email us and we&apos;ll
          get back to you.
        </p>

        <div className="rounded-lg border border-border p-6 text-sm">
          <p className="font-medium">Support Email</p>
          <p className="mt-2">
            <a className="underline" href={`mailto:${supportEmail}`}>
              {supportEmail}
            </a>
          </p>
        </div>
      </section>
      <Footer />
      
      {/* ContactPoint Schema - JSON-LD */}
      <Script id="contact-schema" strategy="afterInteractive">
        {`
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact Us - Nano Banana",
            "description": "Get in touch with Nano Banana support for any questions or assistance.",
            "contactPoint": {
              "@type": "ContactPoint",
              "email": "${supportEmail}",
              "contactType": "customer support",
              "availableLanguage": ["English"]
            }
          }
        `}
      </Script>
    </main>
  )
}

