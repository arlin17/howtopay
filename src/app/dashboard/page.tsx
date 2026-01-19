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

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cheddarl.ink'
  const payLink = `${baseUrl}/${profile.username}`

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Welcome, {profile.display_name || profile.username}
        </h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Manage your payment methods and share your pay link
        </p>
      </div>

      {/* Pay Link Card */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Your pay link
            </h2>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800">
                <code className="text-sm text-zinc-900 dark:text-white">
                  {payLink}
                </code>
              </div>
              <CopyButton
                text={payLink}
                className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-500"
              />
            </div>
            <p className="mt-3 text-sm text-zinc-500">
              Share this link anywhere to let people pay you
            </p>
          </div>
          <div className="flex-shrink-0">
            <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              QR Code
            </h3>
            <div className="mt-2">
              <QRCodeDisplay url={payLink} size={150} />
            </div>
          </div>
        </div>
      </div>

      {/* Ephemeral Links Card */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Ephemeral Links
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Create temporary links that include PII methods (like Zelle)
            </p>
          </div>
          <Link
            href="/dashboard/ephemeral"
            className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
          >
            Create link
          </Link>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Payment methods
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
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
