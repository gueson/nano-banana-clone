"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { Loader2 } from "lucide-react"

type Plan = {
  id: string
  name: string
  price: string
  priceId?: string // Creem product ID
  description: string
  features: string[]
  popular?: boolean
  buttonText: string
}

// Get product IDs from environment variables (client-side accessible)
const getPlans = (): Plan[] => [
  {
    id: "free",
    name: "Free",
    price: "$0",
    description: "Perfect for trying out Nano Banana",
    features: [
      "10 image generations per month",
      "Basic image editing",
      "Standard quality output",
      "Community support",
    ],
    buttonText: "Get Started",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9",
    priceId: process.env.NEXT_PUBLIC_CREEM_PRODUCT_PRO_ID || "pro_monthly",
    description: "For professionals and creators",
    features: [
      "500 image generations per month",
      "Advanced image editing",
      "High quality output",
      "Priority support",
      "Commercial license",
      "API access",
    ],
    popular: true,
    buttonText: "Subscribe Now",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$29",
    priceId: process.env.NEXT_PUBLIC_CREEM_PRODUCT_ENTERPRISE_ID || "enterprise_monthly",
    description: "For teams and businesses",
    features: [
      "Unlimited image generations",
      "All Pro features",
      "Highest quality output",
      "Dedicated support",
      "Team collaboration",
      "Custom integrations",
      "SLA guarantee",
    ],
    buttonText: "Contact Sales",
  },
]

export function Pricing() {
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null)
  const plans = getPlans()

  const handleSubscribe = async (plan: Plan) => {
    if (plan.id === "free") {
      // Redirect to editor for free plan
      window.location.href = "/#editor"
      return
    }

    if (plan.id === "enterprise") {
      // For enterprise, you might want to open a contact form or email
      window.location.href = "mailto:sales@nanobanana.ai?subject=Enterprise Plan Inquiry"
      return
    }

    if (!plan.priceId) {
      console.error("Product ID not configured for plan:", plan.id)
      return
    }

    setLoadingPlanId(plan.id)

    try {
      // Create checkout session with Creem
      const response = await fetch("/api/creem/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: plan.priceId,
          planId: plan.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session")
      }

      if (data.checkoutUrl) {
        // Redirect to Creem checkout page
        window.location.href = data.checkoutUrl
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (error: any) {
      console.error("Checkout error:", error)
      alert(`Failed to start checkout: ${error.message}`)
      setLoadingPlanId(null)
    }
  }

  return (
    <section id="pricing" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Choose the plan that fits your needs. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative flex flex-col ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "$0" && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  size="lg"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handleSubscribe(plan)}
                  disabled={loadingPlanId === plan.id}
                >
                  {loadingPlanId === plan.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    plan.buttonText
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>All plans include a 14-day money-back guarantee. Cancel anytime.</p>
        </div>
      </div>
    </section>
  )
}

