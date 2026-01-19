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
                className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-lg dark:bg-zinc-900">
                    {config?.icon || '?'}
                  </span>
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-white">
                      {config?.name || method.type}
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
