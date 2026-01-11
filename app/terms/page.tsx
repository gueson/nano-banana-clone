import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TermsPage() {
  const supportEmail =
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@example.com"
  const effectiveDate = "2026-01-10"

  return (
    <main className="min-h-screen">
      <Header />
      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Effective date: {effectiveDate}
        </p>

        <div className="space-y-8 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Service</h2>
            <p>
              Nano Banana provides an AI image editor that lets you upload
              images and submit text prompts to generate edits.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Acceptable Use</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Do not upload content you do not have rights to use.</li>
              <li>
                Do not use the service for illegal activities, harassment, or
                harmful content.
              </li>
              <li>
                Do not attempt to disrupt, reverse engineer, or misuse the
                service.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Subscriptions & Billing</h2>
            <p>
              Paid plans are billed on a recurring basis as shown on the Pricing
              page. You can cancel anytime and your access will continue until
              the end of the current billing period unless otherwise stated.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Refunds</h2>
            <p>
              If a refund policy is offered, it will be displayed on the Pricing
              page. For billing questions, contact support.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Disclaimers</h2>
            <p>
              The service is provided on an &quot;as is&quot; and &quot;as
              available&quot; basis. We do not guarantee uninterrupted or
              error-free operation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Contact</h2>
            <p>
              Questions about these terms can be sent to{" "}
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

