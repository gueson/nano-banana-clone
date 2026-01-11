import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ContactPage() {
  const supportEmail =
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@example.com"

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
    </main>
  )
}

