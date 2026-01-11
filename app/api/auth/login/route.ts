import { createClient } from '@/lib/supabase/server'
import { getSiteUrlFromRequest } from '@/lib/site-url'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const provider = searchParams.get('provider') ?? 'google'
  const next = searchParams.get('next') ?? '/'

  const supabase = await createClient()

  const siteUrl = getSiteUrlFromRequest(request)

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
    return NextResponse.redirect(data.url)
  }

  return NextResponse.json({ error: 'Failed to initiate login' }, { status: 500 })
}
