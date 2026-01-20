import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

function getOrigin(request: NextRequest): string {
  // Check for environment variable first (most reliable for production)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }

  // Check X-Forwarded headers (set by reverse proxies like Vercel)
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`
  }

  // Check the host header
  const host = request.headers.get('host')
  if (host && !host.includes('localhost')) {
    const proto = host.includes('localhost') ? 'http' : 'https'
    return `${proto}://${host}`
  }

  // Fallback to nextUrl.origin (works in development)
  return request.nextUrl.origin
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const setup = request.nextUrl.searchParams.get('setup')

  const origin = getOrigin(request)

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
