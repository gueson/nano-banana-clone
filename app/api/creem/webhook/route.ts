import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Verify Creem webhook signature
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  if (!secret) {
    return false
  }

  const hmac = crypto.createHmac('sha256', secret)
  const digest = hmac.update(payload).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-creem-signature') || ''

    // Verify webhook signature
    const webhookSecret = process.env.CREEM_WEBHOOK_SECRET
    if (webhookSecret && !verifyWebhookSignature(body, signature, webhookSecret)) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const event = JSON.parse(body)

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        // Payment successful - update user subscription
        await handleCheckoutCompleted(event.data)
        break

      case 'subscription.created':
      case 'subscription.updated':
        // Subscription created or updated
        await handleSubscriptionUpdate(event.data)
        break

      case 'subscription.canceled':
        // Subscription canceled
        await handleSubscriptionCanceled(event.data)
        break

      case 'payment.succeeded':
        // Payment succeeded
        await handlePaymentSucceeded(event.data)
        break

      case 'payment.failed':
        // Payment failed
        await handlePaymentFailed(event.data)
        break

      default:
        console.log('Unhandled event type:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Handle checkout completion
async function handleCheckoutCompleted(data: any) {
  console.log('Checkout completed:', data)
  // TODO: Update user subscription status in your database
  // Example:
  // - Get user ID from metadata or customer email
  // - Update subscription status in Supabase or your database
  // - Grant access to premium features
}

// Handle subscription update
async function handleSubscriptionUpdate(data: any) {
  console.log('Subscription updated:', data)
  // TODO: Update subscription details in your database
}

// Handle subscription cancellation
async function handleSubscriptionCanceled(data: any) {
  console.log('Subscription canceled:', data)
  // TODO: Revoke premium access in your database
}

// Handle payment success
async function handlePaymentSucceeded(data: any) {
  console.log('Payment succeeded:', data)
  // TODO: Update payment status in your database
}

// Handle payment failure
async function handlePaymentFailed(data: any) {
  console.log('Payment failed:', data)
  // TODO: Notify user or update payment status
}




