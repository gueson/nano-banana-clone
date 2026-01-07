# Creem Payment Integration Setup

This document explains how to set up Creem payment integration for the Nano Banana pricing page.

## Prerequisites

1. Create an account at [Creem](https://creem.io)
2. Get your API key from the Creem dashboard
3. Create products in Creem for each subscription plan

## Environment Variables

Add the following environment variables to your `.env.local` (for local development) and Vercel project settings:

### Required Variables

```bash
# Creem API Key (get from Creem dashboard)
CREEM_API_KEY=your_creem_api_key_here

# Creem Webhook Secret (for verifying webhook signatures)
CREEM_WEBHOOK_SECRET=your_webhook_secret_here

# Site URL (for redirect URLs)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Optional Variables (Product IDs)

If you want to use custom product IDs from Creem:

```bash
# Creem Product IDs (optional, defaults to "pro_monthly" and "enterprise_monthly")
NEXT_PUBLIC_CREEM_PRODUCT_PRO_ID=your_pro_product_id
NEXT_PUBLIC_CREEM_PRODUCT_ENTERPRISE_ID=your_enterprise_product_id
```

## Setting Up Products in Creem

1. Log in to your Creem dashboard
2. Navigate to Products section
3. Create products for each subscription plan:
   - **Pro Plan**: Monthly subscription at $9
   - **Enterprise Plan**: Monthly subscription at $29
4. Copy the Product IDs and add them to your environment variables

## Webhook Configuration

1. In your Creem dashboard, go to Webhooks section
2. Add a new webhook endpoint: `https://your-domain.com/api/creem/webhook`
3. Select the events you want to listen to:
   - `checkout.session.completed`
   - `subscription.created`
   - `subscription.updated`
   - `subscription.canceled`
   - `payment.succeeded`
   - `payment.failed`
4. Copy the webhook secret and add it to `CREEM_WEBHOOK_SECRET`

## API Routes

### `/api/creem/checkout` (POST)

Creates a checkout session with Creem. Called when user clicks "Subscribe" button.

**Request Body:**
```json
{
  "productId": "pro_monthly",
  "planId": "pro"
}
```

**Response:**
```json
{
  "checkoutUrl": "https://checkout.creem.io/...",
  "sessionId": "session_123"
}
```

### `/api/creem/webhook` (POST)

Handles webhook events from Creem. Automatically processes:
- Payment completions
- Subscription updates
- Subscription cancellations
- Payment successes/failures

## Testing

1. Use Creem's test mode for development
2. Test the checkout flow:
   - Click "Subscribe Now" on Pro or Enterprise plan
   - Complete payment in Creem checkout
   - Verify redirect to success page
3. Test webhook events using Creem's webhook testing tool

## Implementation Notes

- The webhook handler includes TODO comments where you need to integrate with your database
- Currently, webhook events are logged to console - you should update the database accordingly
- Consider using Supabase to store subscription status for authenticated users

## Next Steps

1. Implement database integration in webhook handlers
2. Add user authentication checks before checkout
3. Implement subscription status checks in your app
4. Add subscription management page for users

