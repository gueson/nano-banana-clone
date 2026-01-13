import { createRouteHandlerClient } from '@/lib/supabase/route-handler'
import { getSiteUrlFromRequest } from '@/lib/site-url'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function sanitizeNext(value: string | null): string {
  const next = (value || '/').trim()
  if (!next.startsWith('/')) return '/'
  if (next.startsWith('//')) return '/'
  if (next.startsWith('/\\')) return '/'
  if (next.toLowerCase().startsWith('/http')) return '/'
  return next
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = sanitizeNext(searchParams.get('next'))
  const siteUrl = getSiteUrlFromRequest(request)

  if (!code) {
    return NextResponse.redirect(new URL('/auth/auth-code-error', siteUrl))
  }

  const redirectUrl = new URL(next, siteUrl)
  const response = NextResponse.redirect(redirectUrl)
  const supabase = createRouteHandlerClient(request, response)

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    return NextResponse.redirect(new URL('/auth/auth-code-error', siteUrl))
  }

  return response
}
