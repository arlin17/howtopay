'use client'

import { useState } from 'react'
import { PAYMENT_METHODS, formatHandle } from '@/lib/payment-methods'
import type { PaymentMethod, PaymentMethodType } from '@/types/database'

interface ReferralCTAProps {
  method: PaymentMethod
}

export function ReferralCTA({ method }: ReferralCTAProps) {
  const [copied, setCopied] = useState(false)
  const config = PAYMENT_METHODS[method.type as PaymentMethodType]

  if (!config?.referral || !method.referral_code || !method.referral_enabled) {
    return null
  }

  const formattedHandle = formatHandle(method.type as PaymentMethodType, method.handle)

  const handleClick = async (e: React.MouseEvent) => {
    if (config.referral!.type === 'code') {
      e.preventDefault()
      try {
        await navigator.clipboard.writeText(method.referral_code!)
        setCopied(true)
        setTimeout(() => setCopied(false), 3000)
      } catch {
        // Fallback: open cash app download page
        window.open('https://cash.app/app', '_blank')
      }
    }
  }

  if (config.referral.type === 'code') {
    return (
      <button
        onClick={handleClick}
        className="mt-1 block w-full text-center text-xs text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
      >
        {copied ? (
          <span className="text-green-600 dark:text-green-400">
            Code copied! Search for {formattedHandle} after signing up
          </span>
        ) : (
          <>
            New to {config.name}? Copy referral code, then find {formattedHandle} &rarr;
          </>
        )}
      </button>
    )
  }

  return (
    <a
      href={method.referral_code}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-1 block w-full text-center text-xs text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
    >
      New to {config.name}? {config.referral.bonusText}, then find {formattedHandle} &rarr;
    </a>
  )
}
