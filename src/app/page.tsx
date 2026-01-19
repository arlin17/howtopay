import Link from 'next/link'
import { PAYMENT_METHODS } from '@/lib/payment-methods'

export default function Home() {
  const methods = Object.values(PAYMENT_METHODS).slice(0, 6)

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">
            Cheddar<span className="text-yellow-500">l.ink</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto max-w-5xl px-4 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
            One link.
            <br />
            <span className="text-blue-600">All your payment methods.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Stop asking &quot;do you have Venmo?&quot; Share a single link that shows all your payment options.
            Let people pay you however they want.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              Create your pay link
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
            >
              See how it works
            </Link>
          </div>
        </div>

        {/* Demo Card */}
        <div className="mx-auto mt-20 max-w-sm">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white">
                J
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">
                John Doe
              </h3>
              <p className="text-sm text-zinc-500">cheddarl.ink/john</p>
            </div>
            <div className="mt-6 space-y-3">
              {methods.map((method) => (
                <button
                  key={method.type}
                  className="flex w-full items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-left transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-lg dark:bg-zinc-900">
                    {method.icon}
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-white">
                    {method.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* How it works */}
        <section id="how-it-works" className="mt-32">
          <h2 className="text-center text-3xl font-bold text-zinc-900 dark:text-white">
            How it works
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600 dark:bg-blue-900/30">
                1
              </div>
              <h3 className="mt-4 font-semibold text-zinc-900 dark:text-white">
                Add your methods
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Connect your Venmo, CashApp, PayPal, Zelle, and more in seconds.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600 dark:bg-blue-900/30">
                2
              </div>
              <h3 className="mt-4 font-semibold text-zinc-900 dark:text-white">
                Share your link
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Get a custom URL like cheddarl.ink/yourname to share anywhere.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600 dark:bg-blue-900/30">
                3
              </div>
              <h3 className="mt-4 font-semibold text-zinc-900 dark:text-white">
                Get paid
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                People choose their preferred payment method and pay you directly.
              </p>
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="mt-32">
          <h2 className="text-center text-3xl font-bold text-zinc-900 dark:text-white">
            Perfect for
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Splitting bills', desc: 'Dinner, rent, utilities' },
              { title: 'Freelancers', desc: 'Simple invoicing alternative' },
              { title: 'Tip jars', desc: 'Baristas, musicians, creators' },
              { title: 'Side hustles', desc: 'Tutors, dog walkers' },
              { title: 'Group trips', desc: 'Airbnb, tickets, activities' },
              { title: 'Creators', desc: 'Buy me a coffee, support me' },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-32 text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Ready to simplify payments?
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            Create your free pay link in 30 seconds.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-block rounded-full bg-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            Get started for free
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-32 border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <p className="text-center text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} Cheddarl.ink. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
