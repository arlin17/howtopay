'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PAYMENT_METHODS, formatHandle } from '@/lib/payment-methods'
import type { PaymentMethod, PaymentMethodType } from '@/types/database'

interface Props {
  initialMethods: PaymentMethod[]
  userId: string
}

function ReferralBadge({ method }: { method: PaymentMethod }) {
  const config = PAYMENT_METHODS[method.type as PaymentMethodType]
  if (!config?.referral) return null

  if (method.referral_code && method.referral_enabled) {
    return (
      <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
        Referral active
      </span>
    )
  }

  if (method.referral_code && !method.referral_enabled) {
    return (
      <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
        Referral paused
      </span>
    )
  }

  return (
    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
      Referral available
    </span>
  )
}

function ReferralSection({
  method,
  onUpdate,
}: {
  method: PaymentMethod
  onUpdate: (id: string, updates: { referral_code?: string | null; referral_enabled?: boolean }) => Promise<void>
}) {
  const config = PAYMENT_METHODS[method.type as PaymentMethodType]
  const [referralCode, setReferralCode] = useState(method.referral_code || '')
  const [isEnabled, setIsEnabled] = useState(method.referral_enabled)
  const [isSaving, setIsSaving] = useState(false)
  const hasExistingCode = !!method.referral_code
  const [isExpanded, setIsExpanded] = useState(!hasExistingCode)

  if (!config?.referral) return null

  const handleSave = async () => {
    setIsSaving(true)
    await onUpdate(method.id, {
      referral_code: referralCode || null,
      referral_enabled: isEnabled && !!referralCode,
    })
    setIsSaving(false)
  }

  const handleToggle = async () => {
    if (!referralCode) return
    const newEnabled = !isEnabled
    setIsEnabled(newEnabled)
    setIsSaving(true)
    await onUpdate(method.id, { referral_enabled: newEnabled })
    setIsSaving(false)
  }

  const hasChanges = referralCode !== (method.referral_code || '')

  return (
    <div className="mt-3 border-t border-zinc-200 pt-3 dark:border-zinc-700">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between text-sm"
      >
        <span className="flex flex-col items-start gap-0.5">
          <span className="flex items-center gap-2 font-medium text-zinc-700 dark:text-zinc-300">
            Referral Program
            <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
              {config.referral.bonusText}
            </span>
          </span>
          {!hasExistingCode && (
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Refer your friends! Add your promo code from the {config.name} app.
            </span>
          )}
        </span>
        <svg
          className={`h-4 w-4 text-zinc-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-3">
          <div>
            <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">
              {config.referral.inputLabel}
            </label>
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder={config.referral.inputPlaceholder}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white"
            />
          </div>

          {referralCode && (
            <div className="flex items-center justify-between">
              <label className="text-sm text-zinc-600 dark:text-zinc-400">
                Show referral on public page
              </label>
              <button
                onClick={handleToggle}
                disabled={isSaving}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isEnabled ? 'bg-blue-600' : 'bg-zinc-200 dark:bg-zinc-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          )}

          {hasChanges && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save referral'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export function PaymentMethodsManager({ initialMethods, userId }: Props) {
  const router = useRouter()
  const [methods, setMethods] = useState<PaymentMethod[]>(initialMethods)
  const [isAdding, setIsAdding] = useState(false)
  const [newMethodType, setNewMethodType] = useState<PaymentMethodType | ''>('')
  const [newMethodHandle, setNewMethodHandle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const availableTypes = Object.keys(PAYMENT_METHODS).filter(
    (type) => !methods.some((m) => m.type === type)
  ) as PaymentMethodType[]

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMethodType || !newMethodHandle) return

    setLoading(true)
    setError(null)

    const supabase = createClient()
    const methodConfig = PAYMENT_METHODS[newMethodType]

    const { data, error: insertError } = await (supabase
      .from('payment_methods') as any)
      .insert({
        user_id: userId,
        type: newMethodType,
        handle: newMethodHandle,
        is_pii: methodConfig.isPii,
        display_order: methods.length,
      })
      .select()
      .single()

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    setMethods([...methods, data])
    setNewMethodType('')
    setNewMethodHandle('')
    setIsAdding(false)
    setLoading(false)
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    await (supabase.from('payment_methods') as any).delete().eq('id', id)
    setMethods(methods.filter((m) => m.id !== id))
    router.refresh()
  }

  const handleReferralUpdate = async (
    id: string,
    updates: { referral_code?: string | null; referral_enabled?: boolean }
  ) => {
    const supabase = createClient()
    await (supabase.from('payment_methods') as any).update(updates).eq('id', id)
    setMethods(
      methods.map((m) => (m.id === id ? { ...m, ...updates } : m))
    )
    router.refresh()
  }

  return (
    <div className="mt-6 space-y-4">
      {/* Existing methods */}
      {methods.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-500">
          No payment methods added yet. Add one to get started.
        </p>
      ) : (
        <div className="space-y-3">
          {methods.map((method) => {
            const config = PAYMENT_METHODS[method.type as PaymentMethodType]
            return (
              <div
                key={method.id}
                className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-lg dark:bg-zinc-900">
                      {config?.icon || '?'}
                    </span>
                    <div>
                      <p className="flex items-center gap-2 font-medium text-zinc-900 dark:text-white">
                        {config?.name || method.type}
                        <ReferralBadge method={method} />
                      </p>
                      <p className="text-sm text-zinc-500">
                        {formatHandle(method.type as PaymentMethodType, method.handle)}
                        {method.is_pii && (
                          <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            PII
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(method.id)}
                    className="text-sm text-red-600 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
                <ReferralSection method={method} onUpdate={handleReferralUpdate} />
              </div>
            )
          })}
        </div>
      )}

      {/* Add new method */}
      {isAdding ? (
        <form
          onSubmit={handleAdd}
          className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800"
        >
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Payment method
              </label>
              <select
                value={newMethodType}
                onChange={(e) => {
                  setNewMethodType(e.target.value as PaymentMethodType)
                  setNewMethodHandle('')
                }}
                className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white"
              >
                <option value="">Select a method</option>
                {availableTypes.map((type) => (
                  <option key={type} value={type}>
                    {PAYMENT_METHODS[type].icon} {PAYMENT_METHODS[type].name}
                  </option>
                ))}
              </select>
            </div>

            {newMethodType && (
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {PAYMENT_METHODS[newMethodType].description}
                </label>
                <div className="mt-1 flex rounded-lg border border-zinc-300 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-900">
                  {PAYMENT_METHODS[newMethodType].prefix && (
                    <span className="flex items-center pl-4 text-sm text-zinc-500">
                      {PAYMENT_METHODS[newMethodType].prefix}
                    </span>
                  )}
                  <input
                    type="text"
                    value={newMethodHandle}
                    onChange={(e) => setNewMethodHandle(e.target.value)}
                    placeholder={PAYMENT_METHODS[newMethodType].placeholder}
                    className="block w-full rounded-lg border-0 bg-transparent px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-0 dark:text-white"
                  />
                </div>
                {PAYMENT_METHODS[newMethodType].isPii && (
                  <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                    This contains personal info (phone/email). It will only be shown in ephemeral links, not on your public page.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              disabled={loading || !newMethodType || !newMethodHandle}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add method'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false)
                setNewMethodType('')
                setNewMethodHandle('')
                setError(null)
              }}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          disabled={availableTypes.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 px-4 py-4 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-300"
        >
          <span className="text-lg">+</span>
          Add payment method
        </button>
      )}
    </div>
  )
}
