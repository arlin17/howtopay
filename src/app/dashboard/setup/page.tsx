'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SetupPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Validate username
    const usernameRegex = /^[a-z0-9_-]+$/
    if (!usernameRegex.test(username)) {
      setError('Username can only contain lowercase letters, numbers, hyphens, and underscores')
      setLoading(false)
      return
    }

    if (username.length < 3 || username.length > 30) {
      setError('Username must be between 3 and 30 characters')
      setLoading(false)
      return
    }

    const supabase = createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    // Check if username is taken
    const { data: existingUser } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .single()

    if (existingUser) {
      setError('This username is already taken')
      setLoading(false)
      return
    }

    // Check if user already has a profile (update) or needs one created (insert)
    const { data: existingProfile } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (existingProfile) {
      // Update existing profile
      const { error: updateError } = await (supabase
        .from('users') as any)
        .update({
          username,
          display_name: username,
        })
        .eq('id', user.id)

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }
    } else {
      // Create new profile
      const { error: insertError } = await (supabase
        .from('users') as any)
        .insert({
          id: user.id,
          email: user.email!,
          username,
          display_name: username,
        })

      if (insertError) {
        setError(insertError.message)
        setLoading(false)
        return
      }
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-md py-12">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Choose your username
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          This will be your unique pay link URL
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Username
          </label>
          <div className="mt-1 flex rounded-lg border border-zinc-300 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900">
            <span className="flex items-center pl-4 text-sm text-zinc-500">
              howtopay.me/
            </span>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              required
              className="block w-full rounded-r-lg border-0 bg-transparent px-2 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-0 dark:text-white"
              placeholder="yourname"
            />
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            Only lowercase letters, numbers, hyphens, and underscores
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !username}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? 'Setting up...' : 'Continue'}
        </button>
      </form>
    </div>
  )
}
