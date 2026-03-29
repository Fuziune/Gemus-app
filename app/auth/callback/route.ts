import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  if (code) {
    // We establish the Supabase client using your existing utility
    const supabase = await createClient()
    
    // We exchange the secure code for a logged-in user session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    // If the exchange is successful we redirect the user to their protected content
    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }
  }

  // If there's an error (e.g. magic link expired or invalid), redirect to an error page
  return NextResponse.redirect(new URL('/login?error=magicLinkExpiredOrInvalid', requestUrl.origin))
}
