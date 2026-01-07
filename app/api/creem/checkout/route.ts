import { NextRequest, NextResponse } from 'next/server'

// Helper function to get the site URL from request
function getSiteUrl(request: NextRequest): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }

  const forwardedHost = request.headers.get('x-forwarded-host')
  if (forwardedHost) {
    const protocol = request.headers.get('x-forwarded-proto') || 'https'
    return `${protocol}://${forwardedHost}`
  }

  const origin = new URL(request.url).origin
  return origin
}

export async function POST(request: NextRequest) {
  try {
    const { productId, planId } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    if (!process.env.CREEM_API_KEY) {
      return NextResponse.json(
        { error: "Creem API key is not configured" },
        { status: 500 }
      )
    }

    const siteUrl = getSiteUrl(request)

    // Create checkout session with Creem
    const creemResponse = await fetch('https://api.creem.io/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CREEM_API_KEY,
      },
      body: JSON.stringify({
        product_id: productId,
        success_url: `${siteUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/pricing?canceled=true`,
        metadata: {
          plan_id: planId,
        },
      }),
    })

    if (!creemResponse.ok) {
      const errorData = await creemResponse.json().catch(() => ({}))
      console.error('Creem API error:', errorData)
      return NextResponse.json(
        { error: errorData.message || "Failed to create checkout session" },
        { status: creemResponse.status }
      )
    }

    const checkoutData = await creemResponse.json()

    if (!checkoutData.checkout_url) {
      return NextResponse.json(
        { error: "No checkout URL received from Creem" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      checkoutUrl: checkoutData.checkout_url,
      sessionId: checkoutData.session_id,
    })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    )
  }
}

