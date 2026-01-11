function normalizeUrl(value: string): string {
  return value.replace(/\/+$/, '')
}

function isLocalhostUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return (
      url.hostname === 'localhost' ||
      url.hostname === '127.0.0.1' ||
      url.hostname === '0.0.0.0'
    )
  } catch {
    return false
  }
}

export function getSiteUrlFromRequest(request: Request): string {
  const nodeEnv = (process.env.NODE_ENV || '').toLowerCase()
  const vercelEnv = (process.env.VERCEL_ENV || '').toLowerCase()

  const originFromRequest = (() => {
    const url = new URL(request.url)
    const forwardedHost = request.headers.get('x-forwarded-host')
    if (forwardedHost) {
      const forwardedProto = request.headers.get('x-forwarded-proto')
      const protocol = forwardedProto || url.protocol.replace(':', '')
      return `${protocol}://${forwardedHost}`
    }

    return url.origin
  })()

  const normalizedOrigin = normalizeUrl(originFromRequest)

  // In local dev and Vercel preview, prefer the request origin to avoid
  // redirecting OAuth flows to the production domain.
  const isProd = nodeEnv === 'production' && vercelEnv !== 'preview'
  if (!isProd && normalizedOrigin) {
    return normalizedOrigin
  }

  const configured =
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '')

  if (configured) {
    const normalizedConfigured = normalizeUrl(configured)
    if (!isLocalhostUrl(normalizedConfigured)) {
      return normalizedConfigured
    }
  }

  return normalizedOrigin || new URL(request.url).origin
}
