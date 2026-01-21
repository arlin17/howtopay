import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profileData } = await supabase
    .from('users')
    .select('username, display_name')
    .eq('id', user.id)
    .single()

  const profile = profileData as { username: string; display_name: string | null } | null

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background-subtle">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/dashboard" className="text-xl font-bold text-foreground">
            Cheddar<span className="text-primary">l.ink</span>
          </Link>
          <div className="flex items-center gap-4">
            {profile?.username && (
              <Link
                href={`/${profile.username}`}
                target="_blank"
                className="text-sm text-foreground-muted hover:text-foreground"
              >
                View page
              </Link>
            )}
            <form action="/auth/signout" method="POST">
              <button
                type="submit"
                className="text-sm text-foreground-muted hover:text-foreground"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  )
}
