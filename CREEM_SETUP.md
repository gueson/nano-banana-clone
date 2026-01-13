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
# You can provide a single key via CREEM_API_KEY, or split by environment:
# - CREEM_API_KEY_TEST
# - CREEM_API_KEY_LIVE
CREEM_API_KEY=your_creem_api_key_here

# Creem Webhook Secret (for verifying webhook signatures)
CREEM_WEBHOOK_SECRET=your_webhook_secret_here

# Site URL (for redirect URLs)
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Environment switch (recommended)
# - `test` for local dev / staging
# - `live` for production
CREEM_ENV=test

# Live payments gate (recommended):
# - Keep false during onboarding / compliance review
# - Set true only after Creem enables live payments for your account
CREEM_LIVE_PAYMENTS_ENABLED=false

# Optional: Override Creem API base URL directly
CREEM_API_BASE_URL=https://test-api.creem.io

# Optional: support email shown on site/legal pages
NEXT_PUBLIC_SUPPORT_EMAIL=support@your-domain.com
```

### Product IDs (Required for checkout)

These are required to start a checkout session (the app will not fall back to placeholder IDs):

```bash
# Creem Product IDs (recommended: server-only)
# You can provide a single set, or split by environment:
CREEM_PRODUCT_PRO_ID_TEST=your_test_pro_product_id
CREEM_PRODUCT_ENTERPRISE_ID_TEST=your_test_enterprise_product_id
CREEM_PRODUCT_PRO_ID_LIVE=your_live_pro_product_id
CREEM_PRODUCT_ENTERPRISE_ID_LIVE=your_live_enterprise_product_id

# Backwards-compatible (single set used for both modes)
CREEM_PRODUCT_PRO_ID=your_pro_product_id
CREEM_PRODUCT_ENTERPRISE_ID=your_enterprise_product_id

# Optional: also expose to client (not required for checkout)
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
4. If Creem returns `403 Forbidden`, verify:
   - `CREEM_API_KEY` is a server API key (not a publishable/client key)
   - The product IDs belong to the same Creem environment/account as the API key

## Implementation Notes

- The webhook handler includes TODO comments where you need to integrate with your database
- Currently, webhook events are logged to console - you should update the database accordingly
- Consider using Supabase to store subscription status for authenticated users
- Creem checkout creation uses `POST https://api.creem.io/v1/checkouts` (see Creem API docs)
- Mode resolution:
  - Prefer `CREEM_ENV` when set (`test` or `live`)
  - Otherwise fall back to `CREEM_TEST_MODE`
  - Otherwise: `test` in development, `live` in production
- Live payments safety gate:
  - In `live` mode, the app blocks checkout unless `CREEM_LIVE_PAYMENTS_ENABLED=true` is explicitly set
  - This prevents accidentally redirecting users to live checkout before account review/onboarding is complete

## Next Steps

1. Implement database integration in webhook handlers
2. Add user authentication checks before checkout
3. Implement subscription status checks in your app
4. Add subscription management page for users





