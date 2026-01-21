import Link from 'next/link'
import { PAYMENT_METHODS } from '@/lib/payment-methods'
import { UseCaseShowcase } from '@/components/landing/use-case-showcase'

// Structured data for SEO
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Cheddarl.ink',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description:
    'Create a free payment link that shows all your payment options in one place. Accept Venmo, Cash App, PayPal, Zelle, and more.',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '150',
  },
}

export default function Home() {
  const methods = Object.values(PAYMENT_METHODS).slice(0, 5)

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-background">
        {/* Skip link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to main content
        </a>

        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
          <nav
            className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4"
            aria-label="Main navigation"
          >
            <Link
              href="/"
              className="text-xl font-bold text-foreground"
              aria-label="Cheddarl.ink home"
            >
              Cheddar<span className="text-primary">l.ink</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-foreground-muted transition-colors hover:text-foreground"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Sign up free
              </Link>
            </div>
          </nav>
        </header>

        <main id="main-content">
          {/* Hero Section */}
          <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:pt-24">
            {/* Background gradient */}
            <div
              className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"
              aria-hidden="true"
            />

            <div className="mx-auto max-w-6xl">
              <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                {/* Hero Content */}
                <div className="text-center lg:text-left">
                  {/* Trust badge */}
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background-subtle px-4 py-1.5">
                    <span className="flex h-2 w-2 rounded-full bg-success" aria-hidden="true" />
                    <span className="text-sm text-foreground-muted">
                      No fees. Ever.
                    </span>
                  </div>

                  <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                    One link.
                    <br />
                    <span className="text-primary">All your payment methods.</span>
                  </h1>

                  <p className="mx-auto mt-6 max-w-xl text-lg text-foreground-muted lg:mx-0">
                    Stop asking &ldquo;do you have Venmo?&rdquo; Create a single payment page
                    with all your options. Perfect for{' '}
                    <strong className="text-foreground">freelancers</strong>,{' '}
                    <strong className="text-foreground">small businesses</strong>, and{' '}
                    <strong className="text-foreground">side hustles</strong>.
                  </p>

                  {/* CTA buttons */}
                  <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                    <Link
                      href="/signup"
                      className="w-full rounded-full bg-primary px-8 py-4 text-center text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto"
                    >
                      Create your free pay link
                    </Link>
                    <Link
                      href="#how-it-works"
                      className="w-full rounded-full border border-border bg-background px-8 py-4 text-center text-sm font-semibold text-foreground transition-colors hover:bg-background-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus sm:w-auto"
                    >
                      See how it works
                    </Link>
                  </div>

                  {/* Social proof */}
                  <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                    <div className="flex -space-x-2" aria-hidden="true">
                      {['M', 'J', 'S', 'A'].map((letter, i) => (
                        <div
                          key={letter}
                          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-gradient-to-br from-primary to-accent text-xs font-bold text-primary-foreground"
                          style={{ zIndex: 4 - i }}
                        >
                          {letter}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-foreground-muted">
                      <strong className="text-foreground">2,500+</strong> people get paid
                      with Cheddarl.ink
                    </p>
                  </div>
                </div>

                {/* Demo Card */}
                <div className="lg:pl-8">
                  <div
                    className="mx-auto max-w-sm rounded-2xl border border-border bg-background-subtle p-6 shadow-xl shadow-black/10"
                    role="img"
                    aria-label="Example payment page showing multiple payment methods"
                  >
                    <div className="text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-2xl font-bold text-primary-foreground">
                        J
                      </div>
                      <h2 className="mt-4 text-lg font-semibold text-foreground">
                        Jordan Smith
                      </h2>
                      <p className="text-sm text-foreground-muted">
                        cheddarl.ink/jordan
                      </p>
                    </div>
                    <div className="mt-6 space-y-3">
                      {methods.map((method) => (
                        <div
                          key={method.type}
                          className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 transition-colors"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background-muted text-lg font-medium text-foreground">
                            {method.icon}
                          </span>
                          <span className="font-medium text-foreground">
                            {method.name}
                          </span>
                          <svg
                            className="ml-auto h-4 w-4 text-foreground-subtle"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 text-center text-xs text-foreground-subtle">
                      Pick your preferred payment method
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How it works */}
          <section id="how-it-works" className="py-24" aria-labelledby="how-it-works-heading">
            <div className="mx-auto max-w-6xl px-4">
              <div className="text-center">
                <h2 id="how-it-works-heading" className="text-3xl font-bold text-foreground sm:text-4xl">
                  How it works
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-foreground-muted">
                  Set up once, get paid forever. No complicated setup, no fees.
                </p>
              </div>

              <div className="mt-16 grid gap-8 sm:grid-cols-3">
                {[
                  {
                    step: '1',
                    title: 'Add your payment methods',
                    description:
                      'Connect Venmo, Cash App, PayPal, Zelle, and more. Takes less than a minute.',
                  },
                  {
                    step: '2',
                    title: 'Share your unique link',
                    description:
                      'Get a custom URL like cheddarl.ink/you. Share it anywhere—social bios, DMs, or print a QR code.',
                  },
                  {
                    step: '3',
                    title: 'Get paid instantly',
                    description:
                      'Friends and clients pick their preferred payment method and pay you directly. No fees, no middleman.',
                  },
                ].map((item) => (
                  <div key={item.step} className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                      {item.step}
                    </div>
                    <h3 className="mt-6 text-lg font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-foreground-muted">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Use Case Showcase */}
          <section className="bg-background-subtle">
            <div className="mx-auto max-w-6xl px-4">
              <UseCaseShowcase />
            </div>
          </section>

          {/* Perfect for section */}
          <section className="py-24" aria-labelledby="perfect-for-heading">
            <div className="mx-auto max-w-6xl px-4">
              <div className="text-center">
                <h2 id="perfect-for-heading" className="text-3xl font-bold text-foreground sm:text-4xl">
                  Built for everyone who needs to get paid
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-foreground-muted">
                  Whether you&apos;re a freelancer, small business owner, or just splitting
                  dinner with friends—we&apos;ve got you covered.
                </p>
              </div>

              <div
                className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                role="list"
                aria-label="Use cases"
              >
                {[
                  {
                    title: 'Freelancers & Consultants',
                    desc: 'Invoice clients with a simple link. No expensive invoicing software needed.',
                    icon: '💼',
                  },
                  {
                    title: 'Small Businesses',
                    desc: 'Accept payments at your shop, market booth, or food truck with a QR code.',
                    icon: '🏪',
                  },
                  {
                    title: 'Content Creators',
                    desc: 'Let fans support you through their favorite payment app. Better than tip jars.',
                    icon: '🎨',
                  },
                  {
                    title: 'Side Hustlers',
                    desc: 'Tutoring, dog walking, handyman work—get paid however your clients prefer.',
                    icon: '🚀',
                  },
                  {
                    title: 'Event Organizers',
                    desc: 'Collect for group tickets, potlucks, or party funds. Everyone pays their way.',
                    icon: '🎉',
                  },
                  {
                    title: 'Friends & Roommates',
                    desc: 'Split rent, utilities, and dinner without the "what apps do you have?" dance.',
                    icon: '🏠',
                  },
                ].map((item) => (
                  <article
                    key={item.title}
                    className="rounded-xl border border-border bg-background p-6 transition-colors hover:border-primary/50 hover:bg-background-subtle"
                    role="listitem"
                  >
                    <span className="text-3xl" aria-hidden="true">{item.icon}</span>
                    <h3 className="mt-4 font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm text-foreground-muted">{item.desc}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials / Trust section */}
          <section className="border-y border-border bg-background-subtle py-24" aria-labelledby="testimonials-heading">
            <div className="mx-auto max-w-6xl px-4">
              <h2 id="testimonials-heading" className="sr-only">What people are saying</h2>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    quote: "Finally, I don't have to ask every customer which payment app they use. Game changer for my food cart.",
                    author: 'Maria R.',
                    role: 'Food Cart Owner',
                  },
                  {
                    quote: "I put my link in my Instagram bio and my Twitter. Commissions are so much easier now.",
                    author: 'Alex T.',
                    role: 'Freelance Artist',
                  },
                  {
                    quote: "We use it for our band's tip jar. Fans can use whatever app they have. Super simple.",
                    author: 'Jake M.',
                    role: 'Musician',
                  },
                ].map((testimonial, i) => (
                  <blockquote
                    key={i}
                    className="rounded-xl border border-border bg-background p-6"
                  >
                    <p className="text-foreground-muted">&ldquo;{testimonial.quote}&rdquo;</p>
                    <footer className="mt-4">
                      <p className="font-semibold text-foreground">{testimonial.author}</p>
                      <p className="text-sm text-foreground-subtle">{testimonial.role}</p>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-24" aria-labelledby="final-cta">
            <div className="mx-auto max-w-3xl px-4 text-center">
              <h2 id="final-cta" className="text-3xl font-bold text-foreground sm:text-4xl">
                Ready to simplify how you get paid?
              </h2>
              <p className="mt-4 text-lg text-foreground-muted">
                Create your free payment page in under a minute. No credit card required.
              </p>
              <Link
                href="/signup"
                className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-10 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Get started for free
              </Link>
              <p className="mt-4 text-sm text-foreground-subtle">
                Setup takes less than 60 seconds
              </p>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-background-subtle">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div>
                <Link href="/" className="text-lg font-bold text-foreground">
                  Cheddar<span className="text-primary">l.ink</span>
                </Link>
                <p className="mt-1 text-sm text-foreground-muted">
                  One link. All your payment methods.
                </p>
              </div>
              <nav aria-label="Footer navigation">
                <ul className="flex items-center gap-6 text-sm text-foreground-muted">
                  <li>
                    <Link href="/login" className="hover:text-foreground">
                      Log in
                    </Link>
                  </li>
                  <li>
                    <Link href="/signup" className="hover:text-foreground">
                      Sign up
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="mt-8 border-t border-border pt-8 text-center text-sm text-foreground-subtle">
              <p>&copy; {new Date().getFullYear()} Cheddarl.ink. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
