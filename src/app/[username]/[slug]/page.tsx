import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PAYMENT_METHODS, formatHandle } from '@/lib/payment-methods'
import { CopyHandle } from './copy-handle'
import type { PaymentMethodType, User, EphemeralLink, PaymentMethod } from '@/types/database'

interface Props {
  params: Promise<{ username: string; slug: string }>
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
      title: 'Link not found | HowToPay.me',
    }
  }

  const user = data as Pick<User, 'display_name' | 'username'>
  const displayName = user.display_name || user.username

  return {
    title: `Pay ${displayName} | HowToPay.me`,
    description: `Pay ${displayName} - temporary payment link`,
    robots: 'noindex, nofollow', // Don't index ephemeral links
  }
}

export default async function EphemeralPayPage({ params }: Props) {
  const { username, slug } = await params
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

  // Get ephemeral link and check validity
  const { data: linkData } = await supabase
    .from('ephemeral_links')
    .select('*')
    .eq('user_id', user.id)
    .eq('slug', slug)
    .single()

  if (!linkData) {
    notFound()
  }

  const link = linkData as EphemeralLink

  // Check if expired
  const isExpired =
    new Date(link.expires_at) < new Date() || link.view_count >= link.max_views

  if (isExpired) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-2xl dark:bg-amber-900/30">
            ⏰
          </div>
          <h1 className="mt-6 text-xl font-semibold text-zinc-900 dark:text-white">
            Link expired
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            This payment link has expired or reached its view limit.
          </p>
          <Link
            href={`/${username}`}
            className="mt-6 inline-block rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Visit main pay page
          </Link>
        </div>
      </div>
    )
  }

  // Increment view count (eslint and ts issues with Supabase types)
  const updateQuery = supabase.from('ephemeral_links')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (updateQuery as any).update({ view_count: link.view_count + 1 }).eq('id', link.id)

  // Get payment methods for this link
  const { data: linkMethods } = await supabase
    .from('ephemeral_link_methods')
    .select('payment_method_id')
    .eq('ephemeral_link_id', link.id)

  const methodIds = (linkMethods || []).map((m: { payment_method_id: string }) => m.payment_method_id)

  const { data: paymentMethods } = await supabase
    .from('payment_methods')
    .select('*')
    .in('id', methodIds)
    .order('display_order', { ascending: true })

  const methods = (paymentMethods || []) as PaymentMethod[]

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-50 to-white px-4 py-12 dark:from-zinc-950 dark:to-zinc-900">
      <div className="w-full max-w-sm">
        {/* Ephemeral badge */}
        <div className="mb-4 flex items-center justify-center gap-2 text-sm text-amber-600 dark:text-amber-400">
          <span>⏱️</span>
          <span>Temporary link &bull; {link.max_views - link.view_count - 1} views remaining</span>
        </div>

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

            {/* Amount and memo */}
            {(link.amount || link.memo) && (
              <div className="mt-3 rounded-lg bg-blue-50 px-4 py-3 dark:bg-blue-900/20">
                {link.amount && (
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ${link.amount}
                  </p>
                )}
                {link.memo && (
                  <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                    {link.memo}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Payment Methods */}
          <div className="mt-8 space-y-3">
            {methods.map((method) => {
              const config = PAYMENT_METHODS[method.type as PaymentMethodType]
              const url = config?.buildUrl(method.handle, link.amount || undefined, link.memo || undefined)

              // For Zelle (no deep link), show the handle to copy
              if (!url) {
                return (
                  <div
                    key={method.id}
                    className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-lg dark:bg-zinc-900">
                        {config?.icon || '?'}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-zinc-900 dark:text-white">
                          {config?.name || method.type}
                        </p>
                        <p className="text-sm text-zinc-500">Send to:</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-white px-3 py-2 dark:bg-zinc-900">
                      <code className="flex-1 text-sm text-zinc-900 dark:text-white">
                        {method.handle}
                      </code>
                      <CopyHandle handle={method.handle} />
                    </div>
                  </div>
                )
              }

              return (
                <a
                  key={method.id}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                >
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
                </a>
              )
            })}
          </div>
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
