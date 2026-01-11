import { NextResponse } from 'next/server'

function parseBooleanEnv(value: string | undefined): boolean | undefined {
  if (value == null) return undefined
  const normalized = value.trim().toLowerCase()
  if (normalized === 'true' || normalized === '1') return true
  if (normalized === 'false' || normalized === '0') return false
  return undefined
}

function getCreemMode(): 'live' | 'test' {
  const env = (process.env.CREEM_ENV || '').trim().toLowerCase()
  if (env === 'prod' || env === 'production' || env === 'live') return 'live'
  if (env === 'test' || env === 'sandbox') return 'test'

  const testMode = parseBooleanEnv(process.env.CREEM_TEST_MODE)
  if (testMode === true) return 'test'
  if (testMode === false) return 'live'

  // Safer default: do not assume live in production unless explicitly configured.
  return 'test'
}

export async function GET() {
  const mode = getCreemMode()

  // Cannot be reliably detected via API without specific provider support.
  // Default to blocking live checkout unless explicitly enabled to avoid redirecting
  // users to a live flow before Creem enables live payments for the merchant account.
  const livePaymentsEnabledRaw = parseBooleanEnv(
    process.env.CREEM_LIVE_PAYMENTS_ENABLED
  )
  const livePaymentsEnabled =
    livePaymentsEnabledRaw ?? (mode === 'test' ? true : false)

  const creemApiBaseUrl = process.env.CREEM_API_BASE_URL
  const baseUrl = (creemApiBaseUrl ? creemApiBaseUrl : mode === 'test'
    ? 'https://test-api.creem.io'
    : 'https://api.creem.io'
  ).replace(/\/+$/, '')

  const isDev = process.env.NODE_ENV !== 'production'

  return NextResponse.json({
    mode,
    livePaymentsEnabled,
    ...(isDev
      ? {
          debug: {
            baseUrl,
            hasApiKeyTest: !!process.env.CREEM_API_KEY_TEST,
            hasApiKeyLive: !!process.env.CREEM_API_KEY_LIVE,
            hasApiKeyLegacy: !!process.env.CREEM_API_KEY,
            hasProductProTest: !!process.env.CREEM_PRODUCT_PRO_ID_TEST,
            hasProductProLive: !!process.env.CREEM_PRODUCT_PRO_ID_LIVE,
            hasProductEnterpriseTest:
              !!process.env.CREEM_PRODUCT_ENTERPRISE_ID_TEST,
            hasProductEnterpriseLive:
              !!process.env.CREEM_PRODUCT_ENTERPRISE_ID_LIVE,
            hasProductLegacyPro: !!process.env.CREEM_PRODUCT_PRO_ID,
            hasProductLegacyEnterprise: !!process.env.CREEM_PRODUCT_ENTERPRISE_ID,
          },
        }
      : {}),
  })
}
