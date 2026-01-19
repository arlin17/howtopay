export type PaymentMethodType =
  | 'venmo'
  | 'cashapp'
  | 'paypal'
  | 'zelle'
  | 'buymeacoffee'
  | 'kofi'
  | 'github'
  | 'bitcoin'
  | 'ethereum'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      payment_methods: {
        Row: {
          id: string
          user_id: string
          type: PaymentMethodType
          handle: string
          display_order: number
          is_pii: boolean
          referral_code: string | null
          referral_enabled: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: PaymentMethodType
          handle: string
          display_order?: number
          is_pii?: boolean
          referral_code?: string | null
          referral_enabled?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: PaymentMethodType
          handle?: string
          display_order?: number
          is_pii?: boolean
          referral_code?: string | null
          referral_enabled?: boolean
          created_at?: string
        }
      }
      ephemeral_links: {
        Row: {
          id: string
          user_id: string
          slug: string
          amount: number | null
          memo: string | null
          view_count: number
          max_views: number
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          slug: string
          amount?: number | null
          memo?: string | null
          view_count?: number
          max_views?: number
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          slug?: string
          amount?: number | null
          memo?: string | null
          view_count?: number
          max_views?: number
          expires_at?: string
          created_at?: string
        }
      }
      ephemeral_link_methods: {
        Row: {
          ephemeral_link_id: string
          payment_method_id: string
        }
        Insert: {
          ephemeral_link_id: string
          payment_method_id: string
        }
        Update: {
          ephemeral_link_id?: string
          payment_method_id?: string
        }
      }
      page_views: {
        Row: {
          id: string
          user_id: string
          page_type: 'persistent' | 'ephemeral'
          viewed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          page_type?: 'persistent' | 'ephemeral'
          viewed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          page_type?: 'persistent' | 'ephemeral'
          viewed_at?: string
        }
      }
    }
  }
}

// Helper types
export type User = Database['public']['Tables']['users']['Row']
export type PaymentMethod = Database['public']['Tables']['payment_methods']['Row']
export type EphemeralLink = Database['public']['Tables']['ephemeral_links']['Row']
export type PageView = Database['public']['Tables']['page_views']['Row']
