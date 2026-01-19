import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  await supabase.auth.signOut()

  // Use nextUrl.origin which properly handles forwarded headers in production
  // Status 303 (See Other) is correct for POST-to-GET redirects
  return NextResponse.redirect(`${request.nextUrl.origin}/login`, { status: 303 })
}
