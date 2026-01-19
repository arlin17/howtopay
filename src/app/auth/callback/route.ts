import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const setup = request.nextUrl.searchParams.get('setup')

  // Use nextUrl.origin which properly handles forwarded headers in production
  const origin = request.nextUrl.origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // If this is a new Google signup, redirect to username setup
      if (setup === 'true') {
        return NextResponse.redirect(`${origin}/dashboard/setup`)
      }
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  // Return the user to an error page with some instructions
  return NextResponse.redirect(`${origin}/login?error=auth`)
}
