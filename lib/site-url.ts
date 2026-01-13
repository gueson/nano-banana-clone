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

  const url = new URL(request.url)
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto')

  const originFromRequest = forwardedHost
    ? `${forwardedProto || url.protocol.replace(':', '')}://${forwardedHost}`
    : url.origin

  const normalizedOrigin = normalizeUrl(originFromRequest)

  const isProd = nodeEnv === 'production' && vercelEnv !== 'preview'

  // In dev/preview, always prefer the request origin so links and OAuth redirects
  // match the current environment.
  if (!isProd) {
    return normalizedOrigin || url.origin
  }

  // In production, prefer the request origin if it's a real (non-localhost) host.
  // This prevents accidental misconfig (e.g. NEXT_PUBLIC_SITE_URL=localhost) from
  // breaking OAuth redirects on Vercel/custom domains.
  if (normalizedOrigin && !isLocalhostUrl(normalizedOrigin)) {
    return normalizedOrigin
  }

  const candidates = [
    process.env.SITE_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
  ]

  const configured = candidates.find((value) => {
    if (!value) return false
    const normalized = normalizeUrl(value)
    return normalized && !isLocalhostUrl(normalized)
  })

  if (configured) return normalizeUrl(configured)

  return normalizedOrigin || url.origin
}
