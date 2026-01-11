import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    // Not logged in is expected for anonymous users; keep UI calm.
    if (error.message.toLowerCase().includes('auth session missing')) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({ error: error.message }, { status: 401 })
  }

  return NextResponse.json({ user })
}
