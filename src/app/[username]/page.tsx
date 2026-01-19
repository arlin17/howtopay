import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PAYMENT_METHODS, formatHandle } from '@/lib/payment-methods'
import { ReferralCTA } from '@/components/referral-cta'
import type { PaymentMethodType, User, PaymentMethod } from '@/types/database'

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('users')
    .select('display_name, username')
    .eq('username', username)
    .single()

  if (!data) {
    return {
      title: 'User not found | Cheddarl.ink',
    }
  }

  const user = data as Pick<User, 'display_name' | 'username'>
  const displayName = user.display_name || user.username

  return {
    title: `Pay ${displayName} | Cheddarl.ink`,
    description: `Pay ${displayName} with Venmo, CashApp, PayPal, and more`,
  }
}

export default async function PayPage({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()

  // Get user profile
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single()

  if (!userData) {
    notFound()
  }

  const user = userData as User

  // Record page view (fire and forget, don't await)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (supabase.from('page_views') as any)
    .insert({ user_id: user.id, page_type: 'persistent' })
    .then(() => {})

  // Get non-PII payment methods only (persistent page)
  const { data: paymentMethodsData } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_pii', false)
    .order('display_order', { ascending: true })

  const methods = (paymentMethodsData || []) as PaymentMethod[]

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-50 to-white px-4 py-12 dark:from-zinc-950 dark:to-zinc-900">
      <div className="w-full max-w-sm">
        {/* Profile Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-center">
            {/* Avatar */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-3xl font-bold text-white">
              {(user.display_name || user.username).charAt(0).toUpperCase()}
            </div>

            {/* Name */}
            <h1 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-white">
              {user.display_name || user.username}
            </h1>
            <p className="text-sm text-zinc-500">@{user.username}</p>
          </div>

          {/* Payment Methods */}
          {methods.length === 0 ? (
            <div className="mt-8 text-center">
              <p className="text-sm text-zinc-500">
                No payment methods available yet.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-3">
              {methods.map((method) => {
                const config = PAYMENT_METHODS[method.type as PaymentMethodType]
                const url = config?.buildUrl(method.handle)

                const ButtonContent = (
                  <>
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-lg dark:bg-zinc-800">
                      {config?.icon || '?'}
                    </span>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-zinc-900 dark:text-white">
                        {config?.name || method.type}
                      </p>
                      <p className="text-sm text-zinc-500">
                        {formatHandle(method.type as PaymentMethodType, method.handle)}
                      </p>
                    </div>
                    <svg
                      className="h-5 w-5 text-zinc-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </>
                )

                if (url) {
                  return (
                    <div key={method.id}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                      >
                        {ButtonContent}
                      </a>
                      <ReferralCTA method={method} />
                    </div>
                  )
                }

                // For methods without URLs (like Zelle on persistent page - but Zelle is PII so won't show here)
                return (
                  <div key={method.id}>
                    <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800">
                      {ButtonContent}
                    </div>
                    <ReferralCTA method={method} />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            Create your own pay link &rarr;
          </Link>
        </div>
      </div>
    </div>
  )
}
