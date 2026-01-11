"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { Loader2 } from "lucide-react"

type Plan = {
  id: string
  name: string
  price: string
  description: string
  features: string[]
  popular?: boolean
  buttonText: string
}

// Product IDs are resolved server-side in `/api/creem/checkout` to avoid client build-time env issues.
const getPlans = (): Plan[] => [
  {
    id: "free",
    name: "Free",
    price: "$0",
    description: "Perfect for trying out Nano Banana",
    features: [
      "Limited monthly generations",
      "Basic image editing",
      "Standard quality output",
      "Email support",
    ],
    buttonText: "Get Started",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9",
    description: "For professionals and creators",
    features: [
      "Higher monthly generations",
      "Advanced image editing",
      "High quality output",
      "Priority support",
      "Commercial use",
    ],
    popular: true,
    buttonText: "Subscribe Now",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$29",
    description: "For teams and businesses",
    features: [
      "Custom usage limits",
      "Team billing",
      "Dedicated support",
      "Custom integrations (optional)",
    ],
    buttonText: "Contact Sales",
  },
]

export function Pricing() {
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null)
  const [creemConfig, setCreemConfig] = useState<{
    mode: "live" | "test"
    livePaymentsEnabled: boolean
    debug?: {
      baseUrl?: string
      hasApiKeyTest?: boolean
      hasApiKeyLive?: boolean
      hasApiKeyLegacy?: boolean
      hasProductProTest?: boolean
      hasProductProLive?: boolean
      hasProductEnterpriseTest?: boolean
      hasProductEnterpriseLive?: boolean
      hasProductLegacyPro?: boolean
      hasProductLegacyEnterprise?: boolean
    }
  } | null>(null)
  const plans = getPlans()
  const supportEmail =
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@lincy.online"
  const salesEmail =
    process.env.NEXT_PUBLIC_SALES_EMAIL ||
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL ||
    "support@lincy.online"

  useEffect(() => {
    let cancelled = false

    fetch("/api/creem/config")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return
        if (!data) return
        setCreemConfig(data)
      })
      .catch(() => {
        if (cancelled) return
        setCreemConfig(null)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const livePaymentsBlocked =
    creemConfig?.mode === "live" && creemConfig.livePaymentsEnabled === false

  const handleSubscribe = async (plan: Plan) => {
    if (plan.id === "free") {
      // Redirect to editor for free plan
      window.location.href = "/#editor"
      return
    }

    if (plan.id === "enterprise") {
      // For enterprise, you might want to open a contact form or email
      window.location.href = `mailto:${encodeURIComponent(
        salesEmail
      )}?subject=${encodeURIComponent("Enterprise Plan Inquiry")}`
      return
    }

    if (plan.id === "pro" && !creemConfig) {
      alert(
        `Payment configuration is unavailable. Please refresh and try again. If the issue persists, contact ${supportEmail}.`
      )
      return
    }

    if (plan.id === "pro" && livePaymentsBlocked) {
      alert(
        `Live payments are not enabled for this account yet. Complete Creem account verification (or switch to Test Mode) and try again. If you need help, contact ${supportEmail}.`
      )
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
          {creemConfig && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              {/* <span>
                Payments mode:{" "}
                <span className="font-medium text-foreground">
                  {creemConfig.mode === "test" ? "Test" : "Live"}
                </span>
              </span> */}
              {creemConfig.mode === "live" && creemConfig.livePaymentsEnabled === false && (
                <span className="text-destructive">
                  (Live checkout disabled until account review is complete)
                </span>
              )}
              {/* {creemConfig.debug?.baseUrl && (
                <span className="hidden md:inline">· API: {creemConfig.debug.baseUrl}</span>
              )} */}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            (() => {
              const subscribeBlocked = plan.id === "pro" && livePaymentsBlocked

              return (
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
                  disabled={loadingPlanId === plan.id || subscribeBlocked}
                >
                  {loadingPlanId === plan.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    subscribeBlocked ? "Account verification required" : plan.buttonText
                  )}
                </Button>
              </CardFooter>
            </Card>
              )
            })()
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Cancel anytime. Billing terms are shown at checkout.</p>
          <p className="mt-2">
            By subscribing, you agree to our{" "}
            <a className="underline" href="/terms">
              Terms of Service
            </a>{" "}
            and{" "}
            <a className="underline" href="/privacy">
              Privacy Policy
            </a>
            .
          </p>
          <p className="mt-2">
            Need help? Email{" "}
            <a className="underline" href={`mailto:${supportEmail}`}>
              {supportEmail}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
