import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Privacy Policy - Nano Banana AI Image Editor",
  description: "Read the privacy policy for Nano Banana AI Image Editor. Learn how we collect, use, and protect your information.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/privacy`,
  },
}

export default function PrivacyPage() {
  const supportEmail =
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@lincy.online"
  const effectiveDate = "2026-01-10"

  return (
    <main className="min-h-screen">
      <Header />
      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Effective date: {effectiveDate}
        </p>

        <div className="space-y-8 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Summary</h2>
            <p>
              This Privacy Policy explains how Nano Banana (&quot;we&quot;,
              &quot;us&quot;) collects, uses, and shares information when you use
              our website and AI image editor.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Account and contact details you provide (e.g., email).</li>
              <li>Images and prompts you upload or submit for editing.</li>
              <li>
                Usage data (pages viewed, interactions) and basic device/browser
                information.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">How We Use Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Provide and improve the product, including generating edits you
                request.
              </li>
              <li>
                Operate billing and subscriptions, prevent fraud, and
                troubleshoot issues.
              </li>
              <li>
                Communicate with you about support requests, updates, and
                service notices.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Sharing</h2>
            <p>
              We may share information with service providers that help us run
              the product (e.g., hosting, analytics, and payment processing such as Creem). We
              may also share information if required by law or to protect our
              users and services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Data Retention</h2>
            <p>
              We retain information for as long as necessary to provide the
              service and comply with legal obligations. You may request
              deletion by contacting us.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Contact</h2>
            <p>
              Questions about this policy can be sent to{" "}
              <a className="underline" href={`mailto:${supportEmail}`}>
                {supportEmail}
              </a>
              .
            </p>
          </section>
        </div>
      </section>
      <Footer />
    </main>
  )
}

