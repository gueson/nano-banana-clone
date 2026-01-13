import { getSiteUrlFromRequest } from '@/lib/site-url'
import { createRouteHandlerClient } from '@/lib/supabase/route-handler'
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
  const provider = searchParams.get('provider') ?? 'google'
  const next = sanitizeNext(searchParams.get('next'))

  const siteUrl = getSiteUrlFromRequest(request)

  const cookieResponse = NextResponse.next()
  const supabase = createRouteHandlerClient(request, cookieResponse)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as 'google',
    options: {
      redirectTo: `${siteUrl}/api/auth/callback?next=${encodeURIComponent(next)}`,
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  if (data.url) {
    const redirectResponse = NextResponse.redirect(data.url)

    cookieResponse.cookies.getAll().forEach(({ name, value, ...options }) => {
      redirectResponse.cookies.set(name, value, options)
    })

    return redirectResponse
  }

  return NextResponse.json({ error: 'Failed to initiate login' }, { status: 500 })
}
