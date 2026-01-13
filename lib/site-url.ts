function normalizeUrl(value: string): string {
  return value.replace(/\/+$/, '')
}

export function getSiteUrlFromRequest(request: Request): string {
  const url = new URL(request.url)
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto')

  const host = forwardedHost ? forwardedHost.split(',')[0]?.trim() : ''
  const proto = forwardedProto ? forwardedProto.split(',')[0]?.trim() : ''

  const originFromRequest = host
    ? `${proto || url.protocol.replace(':', '')}://${host}`
    : url.origin

  return normalizeUrl(originFromRequest || url.origin)
}
