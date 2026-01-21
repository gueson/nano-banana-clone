import { Metadata } from "next"
import { Header } from "@/components/header"
import { Pricing } from "@/components/pricing"
import { Footer } from "@/components/footer"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Pricing - Nano Banana AI Image Editor",
  description: "Choose the perfect plan for your AI image editing needs. Affordable pricing with advanced features.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/pricing`,
  },
}

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Pricing />
      <Footer />
      
      {/* Product Schema - JSON-LD */}
      <Script id="product-schema" strategy="afterInteractive">
        {`
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Nano Banana Pricing Plans",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "item": {
                  "@type": "Product",
                  "name": "Free Plan",
                  "description": "Perfect for trying out Nano Banana",
                  "url": "${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/pricing#free",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD",
                    "priceSpecification": {
                      "@type": "PriceSpecification",
                      "priceType": "Subscription",
                      "billingPeriod": "P1M"
                    },
                    "availability": "https://schema.org/InStock",
                    "seller": {
                      "@type": "Organization",
                      "name": "Nano Banana"
                    }
                  }
                }
              },
              {
                "@type": "ListItem",
                "position": 2,
                "item": {
                  "@type": "Product",
                  "name": "Pro Plan",
                  "description": "For professionals and creators",
                  "url": "${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/pricing#pro",
                  "offers": {
                    "@type": "Offer",
                    "price": "9",
                    "priceCurrency": "USD",
                    "priceSpecification": {
                      "@type": "PriceSpecification",
                      "priceType": "Subscription",
                      "billingPeriod": "P1M"
                    },
                    "availability": "https://schema.org/InStock",
                    "seller": {
                      "@type": "Organization",
                      "name": "Nano Banana"
                    }
                  }
                }
              },
              {
                "@type": "ListItem",
                "position": 3,
                "item": {
                  "@type": "Product",
                  "name": "Enterprise Plan",
                  "description": "For teams and businesses",
                  "url": "${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/pricing#enterprise",
                  "offers": {
                    "@type": "Offer",
                    "price": "29",
                    "priceCurrency": "USD",
                    "priceSpecification": {
                      "@type": "PriceSpecification",
                      "priceType": "Subscription",
                      "billingPeriod": "P1M"
                    },
                    "availability": "https://schema.org/InStock",
                    "seller": {
                      "@type": "Organization",
                      "name": "Nano Banana"
                    }
                  }
                }
              }
            ]
          }
        `}
      </Script>
    </main>
  )
}





