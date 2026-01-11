import { createRouteHandlerClient } from '@/lib/supabase/route-handler'
import { getSiteUrlFromRequest } from '@/lib/site-url'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
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
