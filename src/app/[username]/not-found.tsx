import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-zinc-900 dark:text-white">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-white">
          User not found
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          This pay page doesn&apos;t exist or may have been removed.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Go home
          </Link>
          <Link
            href="/signup"
            className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
          >
            Create your own
          </Link>
        </div>
      </div>
    </div>
  )
}
