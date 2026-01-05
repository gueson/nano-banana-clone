import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

function getSiteUrl(request: Request): string {
  // 优先使用环境变量中配置的站点地址（推荐在 Vercel 上配置）
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }

  // 在 Vercel 等代理环境中，使用 x-forwarded-host / x-forwarded-proto
  const forwardedHost = request.headers.get('x-forwarded-host')
  if (forwardedHost) {
    const protocol = request.headers.get('x-forwarded-proto') || 'https'
    return `${protocol}://${forwardedHost}`
  }

  // 本地或其他环境回退到请求本身的 origin
  const { origin } = new URL(request.url)
  return origin
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const provider = searchParams.get('provider') ?? 'google'
  const next = searchParams.get('next') ?? '/'

  const supabase = await createClient()

  const siteUrl = getSiteUrl(request)

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

