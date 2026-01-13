import { NextRequest, NextResponse } from "next/server"
import { getSiteUrlFromRequest } from "@/lib/site-url"
import { createClient } from "@/lib/supabase/server"

function parseBooleanEnv(value: string | undefined): boolean | undefined {
  if (value == null) return undefined
  const normalized = value.trim().toLowerCase()
  if (normalized === "true" || normalized === "1") return true
  if (normalized === "false" || normalized === "0") return false
  return undefined
}

function normalizePlanKey(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined
  const normalized = value.trim().toLowerCase()
  return normalized ? normalized : undefined
}

function getConfiguredProductId(planKey: string | undefined, mode: "live" | "test"): string | undefined {
  if (!planKey) return undefined

  if (planKey === "pro") {
    return (
      (mode === "live" ? process.env.CREEM_PRODUCT_PRO_ID_LIVE : process.env.CREEM_PRODUCT_PRO_ID_TEST) ||
      process.env.CREEM_PRODUCT_PRO_ID ||
      (mode === "live" ? process.env.NEXT_PUBLIC_CREEM_PRODUCT_PRO_ID_LIVE : process.env.NEXT_PUBLIC_CREEM_PRODUCT_PRO_ID_TEST) ||
      process.env.NEXT_PUBLIC_CREEM_PRODUCT_PRO_ID
    )
  }

  if (planKey === "enterprise") {
    return (
      (mode === "live" ? process.env.CREEM_PRODUCT_ENTERPRISE_ID_LIVE : process.env.CREEM_PRODUCT_ENTERPRISE_ID_TEST) ||
      process.env.CREEM_PRODUCT_ENTERPRISE_ID ||
      (mode === "live"
        ? process.env.NEXT_PUBLIC_CREEM_PRODUCT_ENTERPRISE_ID_LIVE
        : process.env.NEXT_PUBLIC_CREEM_PRODUCT_ENTERPRISE_ID_TEST) ||
      process.env.NEXT_PUBLIC_CREEM_PRODUCT_ENTERPRISE_ID
    )
  }

  return undefined
}

function resolveCheckoutProductId(input: { planId: unknown; productId: unknown; mode: "live" | "test" }): string | undefined {
  const planKey = normalizePlanKey(input.planId)
  const rawProductId = typeof input.productId === "string" ? input.productId.trim() : ""

  // Prefer server-configured product IDs (avoids relying on client-side NEXT_PUBLIC env injection)
  const fromPlan = getConfiguredProductId(planKey, input.mode)
  if (fromPlan) return fromPlan

  // Accept explicit Creem product IDs when provided
  if (rawProductId.startsWith("prod_")) return rawProductId

  // Backwards compatibility: map common placeholder product IDs to env-configured IDs
  const placeholderKey = normalizePlanKey(rawProductId)
  if (placeholderKey === "pro_monthly" || placeholderKey === "pro-monthly") {
    return getConfiguredProductId("pro", input.mode)
  }
  if (placeholderKey === "enterprise_monthly" || placeholderKey === "enterprise-monthly") {
    return getConfiguredProductId("enterprise", input.mode)
  }

  return undefined
}

function getCreemMode(): "live" | "test" {
  const env = (process.env.CREEM_ENV || "").trim().toLowerCase()
  if (env === "prod" || env === "production" || env === "live") return "live"
  if (env === "test" || env === "sandbox") return "test"

  const testMode = parseBooleanEnv(process.env.CREEM_TEST_MODE)
  if (testMode === true) return "test"
  if (testMode === false) return "live"

  // Safer default: do not assume live in production unless explicitly configured.
  return "test"
}

function getCreemBaseUrl(mode: "live" | "test"): string {
  const explicit = process.env.NODE_ENV !== "production" ? process.env.CREEM_API_BASE_URL : undefined
  if (explicit) return explicit.replace(/\/+$/, "")

  return mode === "test" ? "https://test-api.creem.io" : "https://api.creem.io"
}

function getCreemApiKey(mode: "live" | "test"): string | undefined {
  return (mode === "live" ? process.env.CREEM_API_KEY_LIVE : process.env.CREEM_API_KEY_TEST) || process.env.CREEM_API_KEY
}

function getCreemFallbackToTestMode(): boolean {
  const raw = parseBooleanEnv(process.env.CREEM_FALLBACK_TO_TEST_MODE)
  return raw ?? (process.env.NODE_ENV !== "production")
}

// Helper function to get the site URL from request
export async function POST(request: NextRequest) {
  try {
    const { productId, planId } = await request.json().catch(() => ({}))

    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      if (userError.message.toLowerCase().includes("auth session missing")) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        )
      }

      return NextResponse.json({ error: userError.message }, { status: 401 })
    }

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const configuredMode = getCreemMode()

    const livePaymentsEnabledRaw = parseBooleanEnv(process.env.CREEM_LIVE_PAYMENTS_ENABLED)
    const livePaymentsEnabled = livePaymentsEnabledRaw ?? (configuredMode === "test" ? true : false)

    const fallbackToTest = getCreemFallbackToTestMode()
    const mode =
      configuredMode === "live" && livePaymentsEnabled !== true && fallbackToTest
        ? "test"
        : configuredMode

    if (configuredMode === "live" && mode === "live" && livePaymentsEnabled !== true) {
      return NextResponse.json(
        {
          error:
            "Creem live payments are not enabled for this account yet. Complete Creem account verification/onboarding (or switch to Test Mode) and try again.",
        },
        { status: 403 }
      )
    }

    const resolvedProductId = resolveCheckoutProductId({ productId, planId, mode })

    if (!resolvedProductId) {
      return NextResponse.json(
        {
          error:
            "Creem product ID is not configured. Set CREEM_PRODUCT_PRO_ID / CREEM_PRODUCT_ENTERPRISE_ID (recommended) or NEXT_PUBLIC_CREEM_PRODUCT_PRO_ID / NEXT_PUBLIC_CREEM_PRODUCT_ENTERPRISE_ID (see CREEM_SETUP.md).",
          ...(process.env.NODE_ENV !== "production"
            ? {
                debug: {
                  planId,
                  mode,
                  configuredMode,
                  hasCreemProId: !!process.env.CREEM_PRODUCT_PRO_ID,
                  hasCreemEnterpriseId: !!process.env.CREEM_PRODUCT_ENTERPRISE_ID,
                  hasPublicProId: !!process.env.NEXT_PUBLIC_CREEM_PRODUCT_PRO_ID,
                  hasPublicEnterpriseId: !!process.env.NEXT_PUBLIC_CREEM_PRODUCT_ENTERPRISE_ID,
                },
              }
            : {}),
        },
        { status: 400 }
      )
    }

    // Avoid calling Creem with placeholder IDs (commonly left as defaults in docs),
    // which results in confusing 404s from the upstream API.
    if (resolvedProductId === "pro_monthly" || resolvedProductId === "enterprise_monthly") {
      return NextResponse.json(
        {
          error:
            "Creem product ID is not configured. Set CREEM_PRODUCT_PRO_ID / CREEM_PRODUCT_ENTERPRISE_ID (recommended) or NEXT_PUBLIC_CREEM_PRODUCT_PRO_ID / NEXT_PUBLIC_CREEM_PRODUCT_ENTERPRISE_ID (see CREEM_SETUP.md).",
        },
        { status: 500 }
      )
    }

    const creemApiKey = getCreemApiKey(mode)
    if (!creemApiKey) {
      return NextResponse.json({ error: "Creem API key is not configured" }, { status: 500 })
    }

    const siteUrl = getSiteUrlFromRequest(request)

    const requestId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`

    const requestBody = {
      product_id: resolvedProductId,
      request_id: requestId,
      units: 1,
      success_url: `${siteUrl}/pricing/success`,
      metadata: {
        plan_id: planId,
        configured_mode: configuredMode,
        effective_mode: mode,
      },
    }

    const creemUrl = `${getCreemBaseUrl(mode)}/v1/checkouts`
    let creemResponse = await fetch(creemUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": creemApiKey,
      },
      body: JSON.stringify(requestBody),
    })

    if (!creemResponse.ok) {
      const errorData = await creemResponse.json().catch(async () => {
        const text = await creemResponse.text().catch(() => "")
        return { raw: text }
      })

      console.error("Creem API error:", {
        status: creemResponse.status,
        url: creemUrl,
        planId,
        productId: resolvedProductId,
        error: errorData,
      })

      let message =
        (errorData && (errorData.message || errorData.error || errorData.detail)) ||
        "Failed to create checkout session"

      if (creemResponse.status === 401 || creemResponse.status === 403) {
        message = `${message}. Verify CREEM_API_KEY is a valid Creem API key and matches the environment (Production vs Test Mode) for product ${resolvedProductId}.`
      }

      return NextResponse.json(
        {
          error: message,
          ...(process.env.NODE_ENV !== "production"
            ? {
                debug: {
                  upstreamStatus: creemResponse.status,
                  planId,
                  productId: resolvedProductId,
                  traceId: errorData?.trace_id,
                  configuredMode,
                  mode,
                },
              }
            : {}),
        },
        { status: creemResponse.status }
      )
    }

    const checkoutData = await creemResponse.json()

    if (!checkoutData.checkout_url) {
      return NextResponse.json({ error: "No checkout URL received from Creem" }, { status: 500 })
    }

    return NextResponse.json({
      checkoutUrl: checkoutData.checkout_url,
      sessionId: checkoutData.id,
      requestId,
      configuredMode,
      mode: checkoutData.mode || mode,
    })
  } catch (error: any) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: error.message || "Failed to create checkout session" }, { status: 500 })
  }
}
