import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EphemeralLinkGenerator } from './ephemeral-link-generator'
import type { PaymentMethod, EphemeralLink } from '@/types/database'

export default async function EphemeralPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profileData } = await supabase
    .from('users')
    .select('username')
    .eq('id', user.id)
    .single()

  const profile = profileData as { username: string } | null

  if (!profile?.username) {
    redirect('/dashboard/setup')
  }

  // Get all payment methods (including PII)
  const { data: paymentMethodsData } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', user.id)
    .order('display_order', { ascending: true })

  // Get existing ephemeral links
  const { data: ephemeralLinksData } = await supabase
    .from('ephemeral_links')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://howtopay.me'

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Ephemeral Links
        </h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Create temporary payment links that include your PII methods (like Zelle).
          Links expire after 24 hours or 3 views.
        </p>
      </div>

      <EphemeralLinkGenerator
        userId={user.id}
        username={profile.username}
        paymentMethods={(paymentMethodsData || []) as PaymentMethod[]}
        existingLinks={(ephemeralLinksData || []) as EphemeralLink[]}
        baseUrl={baseUrl}
      />
    </div>
  )
}
