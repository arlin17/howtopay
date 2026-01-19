'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PAYMENT_METHODS, generateEphemeralSlug, formatHandle } from '@/lib/payment-methods'
import type { PaymentMethod, EphemeralLink, PaymentMethodType } from '@/types/database'

interface Props {
  userId: string
  username: string
  paymentMethods: PaymentMethod[]
  existingLinks: EphemeralLink[]
  baseUrl: string
}

export function EphemeralLinkGenerator({
  userId,
  username,
  paymentMethods,
  existingLinks,
  baseUrl,
}: Props) {
  const router = useRouter()
  const [selectedMethods, setSelectedMethods] = useState<string[]>([])
  const [amount, setAmount] = useState('')
  const [memo, setMemo] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedLink, setGeneratedLink] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleToggleMethod = (methodId: string) => {
    setSelectedMethods((prev) =>
      prev.includes(methodId)
        ? prev.filter((id) => id !== methodId)
        : [...prev, methodId]
    )
  }

  const handleGenerate = async () => {
    if (selectedMethods.length === 0) {
      setError('Select at least one payment method')
      return
    }

    setLoading(true)
    setError(null)

    const supabase = createClient()
    const slug = generateEphemeralSlug()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours

    // Create ephemeral link
    const { data: link, error: linkError } = await (supabase
      .from('ephemeral_links') as any)
      .insert({
        user_id: userId,
        slug,
        amount: amount ? parseFloat(amount) : null,
        memo: memo || null,
        expires_at: expiresAt,
      })
      .select()
      .single()

    if (linkError) {
      setError(linkError.message)
      setLoading(false)
      return
    }

    // Add payment methods to the link
    const methodInserts = selectedMethods.map((methodId) => ({
      ephemeral_link_id: link.id,
      payment_method_id: methodId,
    }))

    const { error: methodsError } = await (supabase
      .from('ephemeral_link_methods') as any)
      .insert(methodInserts)

    if (methodsError) {
      setError(methodsError.message)
      setLoading(false)
      return
    }

    const fullLink = `${baseUrl}/${username}/${slug}`
    setGeneratedLink(fullLink)
    setLoading(false)
    router.refresh()
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
  }

  const formatExpiry = (expiresAt: string) => {
    const expires = new Date(expiresAt)
    const now = new Date()
    const diff = expires.getTime() - now.getTime()

    if (diff < 0) return 'Expired'

    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours > 0) return `${hours}h remaining`

    const minutes = Math.floor(diff / (1000 * 60))
    return `${minutes}m remaining`
  }

  return (
    <div className="space-y-8">
      {/* Generator */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Create new ephemeral link
        </h2>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {generatedLink ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Link created successfully!
              </p>
              <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                Expires in 24 hours or after 3 views
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800">
                <code className="text-sm text-zinc-900 dark:text-white">
                  {generatedLink}
                </code>
              </div>
              <button
                onClick={() => handleCopy(generatedLink)}
                className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-500"
              >
                Copy
              </button>
            </div>
            <button
              onClick={() => {
                setGeneratedLink(null)
                setSelectedMethods([])
                setAmount('')
                setMemo('')
              }}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Create another link
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {/* Payment method selection */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Select payment methods to include
              </label>
              <div className="mt-3 space-y-2">
                {paymentMethods.length === 0 ? (
                  <p className="text-sm text-zinc-500">
                    No payment methods added yet. Add some in your dashboard first.
                  </p>
                ) : (
                  paymentMethods.map((method) => {
                    const config = PAYMENT_METHODS[method.type as PaymentMethodType]
                    return (
                      <label
                        key={method.id}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                      >
                        <input
                          type="checkbox"
                          checked={selectedMethods.includes(method.id)}
                          onChange={() => handleToggleMethod(method.id)}
                          className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-lg dark:bg-zinc-900">
                          {config?.icon || '?'}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium text-zinc-900 dark:text-white">
                            {config?.name || method.type}
                          </p>
                          <p className="text-sm text-zinc-500">
                            {formatHandle(method.type as PaymentMethodType, method.handle)}
                          </p>
                        </div>
                        {method.is_pii && (
                          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            PII
                          </span>
                        )}
                      </label>
                    )
                  })
                )}
              </div>
            </div>

            {/* Optional amount */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Amount (optional)
              </label>
              <div className="mt-1 flex rounded-lg border border-zinc-300 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900">
                <span className="flex items-center pl-4 text-sm text-zinc-500">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="block w-full rounded-r-lg border-0 bg-transparent px-2 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-0 dark:text-white"
                />
              </div>
            </div>

            {/* Optional memo */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Memo (optional)
              </label>
              <input
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="e.g., Dinner split, Rent January"
                className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || selectedMethods.length === 0}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate ephemeral link'}
            </button>
          </div>
        )}
      </div>

      {/* Recent links */}
      {existingLinks.length > 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Recent ephemeral links
          </h2>
          <div className="mt-4 space-y-3">
            {existingLinks.map((link) => {
              const isExpired =
                new Date(link.expires_at) < new Date() ||
                link.view_count >= link.max_views
              const fullLink = `${baseUrl}/${username}/${link.slug}`

              return (
                <div
                  key={link.id}
                  className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                    isExpired
                      ? 'border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/50'
                      : 'border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate font-mono text-sm ${
                        isExpired
                          ? 'text-zinc-400 line-through'
                          : 'text-zinc-900 dark:text-white'
                      }`}
                    >
                      {fullLink}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500">
                      {link.amount && <span>${link.amount}</span>}
                      {link.memo && <span>{link.memo}</span>}
                      <span>
                        {link.view_count}/{link.max_views} views
                      </span>
                      <span>{formatExpiry(link.expires_at)}</span>
                    </div>
                  </div>
                  {!isExpired && (
                    <button
                      onClick={() => handleCopy(fullLink)}
                      className="ml-4 text-sm text-blue-600 hover:text-blue-500"
                    >
                      Copy
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
