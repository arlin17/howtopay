import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PaymentMethodsManager } from './payment-methods-manager'
import { CopyButton } from './copy-button'
import { QRCodeDisplay } from './qr-code'
import type { User, PaymentMethod } from '@/types/database'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profileData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const profile = profileData as User | null

  // If no username set (e.g., Google OAuth without username), redirect to setup
  if (!profile?.username) {
    redirect('/dashboard/setup')
  }

  // Get payment methods
  const { data: paymentMethodsData } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', user.id)
    .order('display_order', { ascending: true })

  const paymentMethods = (paymentMethodsData || []) as PaymentMethod[]

  // Get analytics
  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [totalViewsResult, last7DaysResult, last24HoursResult] = await Promise.all([
    supabase
      .from('page_views')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabase
      .from('page_views')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('viewed_at', sevenDaysAgo),
    supabase
      .from('page_views')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('viewed_at', oneDayAgo),
  ])

  const totalViews = totalViewsResult.count || 0
  const last7Days = last7DaysResult.count || 0
  const last24Hours = last24HoursResult.count || 0

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cheddarl.ink'
  const payLink = `${baseUrl}/${profile.username}`

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome, {profile.display_name || profile.username}
        </h1>
        <p className="mt-1 text-foreground-muted">
          Manage your payment methods and share your pay link
        </p>
      </div>

      {/* Analytics - Simple inline display */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-foreground-muted">
        <span>
          <span className="font-semibold text-foreground">{totalViews}</span> total views
        </span>
        <span className="hidden sm:inline text-border">•</span>
        <span>
          <span className="font-semibold text-foreground">{last7Days}</span> this week
        </span>
        <span className="hidden sm:inline text-border">•</span>
        <span>
          <span className="font-semibold text-foreground">{last24Hours}</span> today
        </span>
      </div>

      {/* Pay Link Card */}
      <div className="rounded-xl border border-border bg-background-subtle p-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-foreground">
              Your pay link
            </h2>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1 overflow-hidden rounded-lg border border-border bg-background-muted px-4 py-3">
                <code className="block truncate text-sm text-foreground">
                  {payLink}
                </code>
              </div>
              <CopyButton
                text={payLink}
                className="shrink-0 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
              />
            </div>
            <p className="mt-3 text-sm text-foreground-muted">
              Share this link anywhere to let people pay you
            </p>
          </div>
          <div className="flex justify-center lg:justify-start">
            <QRCodeDisplay url={payLink} size={150} />
          </div>
        </div>
      </div>

      {/* Ephemeral Links Card */}
      <div className="rounded-xl border border-border bg-background-subtle p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Ephemeral Links
            </h2>
            <p className="mt-1 text-sm text-foreground-muted">
              Create temporary links that include PII methods (like Zelle)
            </p>
          </div>
          <Link
            href="/dashboard/ephemeral"
            className="shrink-0 rounded-lg bg-background-muted px-4 py-2 text-center text-sm font-medium text-foreground hover:bg-border"
          >
            Create link
          </Link>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="rounded-xl border border-border bg-background-subtle p-6">
        <h2 className="text-lg font-semibold text-foreground">
          Payment methods
        </h2>
        <p className="mt-1 text-sm text-foreground-muted">
          Add your payment methods so people can pay you
        </p>
        <PaymentMethodsManager
          initialMethods={paymentMethods}
          userId={user.id}
        />
      </div>
    </div>
  )
}
