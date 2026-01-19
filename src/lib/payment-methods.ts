import { PaymentMethodType } from '@/types/database'

export interface PaymentMethodConfig {
  type: PaymentMethodType
  name: string
  icon: string // We'll use simple text icons for now, can upgrade to SVG later
  placeholder: string
  prefix?: string
  buildUrl: (handle: string, amount?: number, memo?: string) => string | null
  isPii: boolean
  description: string
}

export const PAYMENT_METHODS: Record<PaymentMethodType, PaymentMethodConfig> = {
  venmo: {
    type: 'venmo',
    name: 'Venmo',
    icon: 'V',
    placeholder: 'username',
    prefix: '@',
    buildUrl: (handle, amount, memo) => {
      const params = new URLSearchParams({
        txn: 'pay',
        recipients: handle.replace('@', ''),
      })
      if (amount) params.set('amount', amount.toString())
      if (memo) params.set('note', memo)
      return `venmo://paycharge?${params.toString()}`
    },
    isPii: false,
    description: 'Venmo username (without @)',
  },
  cashapp: {
    type: 'cashapp',
    name: 'Cash App',
    icon: '$',
    placeholder: 'cashtag',
    prefix: '$',
    buildUrl: (handle, amount) => {
      const tag = handle.replace('$', '')
      if (amount) {
        return `https://cash.app/$${tag}/${amount}`
      }
      return `https://cash.app/$${tag}`
    },
    isPii: false,
    description: 'Cash App $cashtag (without $)',
  },
  paypal: {
    type: 'paypal',
    name: 'PayPal',
    icon: 'P',
    placeholder: 'username',
    buildUrl: (handle, amount) => {
      if (amount) {
        return `https://paypal.me/${handle}/${amount}`
      }
      return `https://paypal.me/${handle}`
    },
    isPii: false,
    description: 'PayPal.me username',
  },
  zelle: {
    type: 'zelle',
    name: 'Zelle',
    icon: 'Z',
    placeholder: 'phone or email',
    buildUrl: () => null, // No universal deep link for Zelle
    isPii: true,
    description: 'Phone number or email (will be shown to payer)',
  },
  buymeacoffee: {
    type: 'buymeacoffee',
    name: 'Buy Me a Coffee',
    icon: '☕',
    placeholder: 'username',
    buildUrl: (handle) => `https://buymeacoffee.com/${handle}`,
    isPii: false,
    description: 'Buy Me a Coffee username',
  },
  kofi: {
    type: 'kofi',
    name: 'Ko-fi',
    icon: 'K',
    placeholder: 'username',
    buildUrl: (handle) => `https://ko-fi.com/${handle}`,
    isPii: false,
    description: 'Ko-fi username',
  },
  github: {
    type: 'github',
    name: 'GitHub Sponsors',
    icon: 'G',
    placeholder: 'username',
    buildUrl: (handle) => `https://github.com/sponsors/${handle}`,
    isPii: false,
    description: 'GitHub username',
  },
  bitcoin: {
    type: 'bitcoin',
    name: 'Bitcoin',
    icon: '₿',
    placeholder: 'wallet address',
    buildUrl: (handle, amount) => {
      if (amount) {
        return `bitcoin:${handle}?amount=${amount}`
      }
      return `bitcoin:${handle}`
    },
    isPii: false,
    description: 'Bitcoin wallet address',
  },
  ethereum: {
    type: 'ethereum',
    name: 'Ethereum',
    icon: 'Ξ',
    placeholder: 'wallet address or ENS',
    buildUrl: (handle) => {
      // Basic ethereum URI, wallets handle this differently
      return `ethereum:${handle}`
    },
    isPii: false,
    description: 'Ethereum address or ENS name',
  },
}

// Get non-PII methods (safe for persistent pages)
export function getSafePaymentMethods(): PaymentMethodConfig[] {
  return Object.values(PAYMENT_METHODS).filter((m) => !m.isPii)
}

// Get all methods (for ephemeral links)
export function getAllPaymentMethods(): PaymentMethodConfig[] {
  return Object.values(PAYMENT_METHODS)
}

// Get PII methods only
export function getPiiPaymentMethods(): PaymentMethodConfig[] {
  return Object.values(PAYMENT_METHODS).filter((m) => m.isPii)
}

// Generate a random slug for ephemeral links
export function generateEphemeralSlug(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Format handle for display
export function formatHandle(type: PaymentMethodType, handle: string): string {
  const config = PAYMENT_METHODS[type]
  if (config.prefix && !handle.startsWith(config.prefix)) {
    return `${config.prefix}${handle}`
  }
  return handle
}
