// Social media profile mockup
function SocialProfileMockup() {
  return (
    <div className="w-full max-w-[320px] rounded-xl border border-border bg-background-subtle p-4 shadow-lg" role="img" aria-label="Social media profile with Cheddarl.ink in bio">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600" />
        <div>
          <p className="font-semibold text-foreground">@artbylex</p>
          <p className="text-xs text-foreground-muted">Digital Artist</p>
        </div>
      </div>
      {/* Bio */}
      <div className="mt-3">
        <p className="text-sm text-foreground-muted">
          Commissions open! Character art &amp; illustrations.
        </p>
        <p className="mt-1 text-sm">
          <span className="text-primary font-medium">cheddarl.ink/artbylex</span>
        </p>
      </div>
      {/* Stats */}
      <div className="mt-3 flex gap-4 text-xs">
        <span><strong className="text-foreground">8.2K</strong> <span className="text-foreground-muted">followers</span></span>
        <span><strong className="text-foreground">341</strong> <span className="text-foreground-muted">following</span></span>
      </div>
    </div>
  )
}

// Discord DM mockup
function DiscordDMMockup() {
  return (
    <div className="w-full max-w-[360px] rounded-xl border border-border bg-[#36393f] p-4 shadow-lg" role="img" aria-label="Discord direct message with payment link">
      {/* Channel header */}
      <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500" />
        <span className="font-semibold text-white">CardTrader99</span>
      </div>
      {/* Messages */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="h-8 w-8 shrink-0 rounded-full bg-gray-600" />
          <div>
            <p className="text-xs text-gray-400">CardTrader99 <span className="text-gray-500">Today at 3:42 PM</span></p>
            <p className="text-sm text-gray-200">Hey! I&apos;ll take that Charizard for $85</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-green-500 to-emerald-600" />
          <div>
            <p className="text-xs text-gray-400">You <span className="text-gray-500">Today at 3:45 PM</span></p>
            <p className="text-sm text-gray-200">Awesome! Here&apos;s my payment link:</p>
            <p className="mt-1 text-sm text-[#00b0f4] hover:underline">cheddarl.ink/cardking</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// QR Code stand mockup
function QRCodeStandMockup() {
  // More realistic QR code pattern (21x21 standard)
  const qrPattern = [
    1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,
    1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1,
    1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,
    1,0,1,1,1,0,1,0,0,1,0,1,1,0,1,0,1,1,1,0,1,
    1,0,1,1,1,0,1,0,1,0,1,0,0,0,1,0,1,1,1,0,1,
    1,0,0,0,0,0,1,0,0,1,1,1,0,0,1,0,0,0,0,0,1,
    1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,
    0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,
    1,0,1,1,0,1,1,1,0,0,1,0,0,1,1,0,1,0,1,1,0,
    0,1,0,1,1,0,0,1,1,0,0,0,0,0,1,1,0,1,0,0,1,
    1,0,1,0,1,1,1,0,1,0,0,0,0,0,1,0,1,0,1,0,1,
    0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,1,0,1,0,
    1,0,1,0,1,1,1,0,1,0,0,0,0,0,1,0,1,0,1,0,1,
    0,0,0,0,0,0,0,0,1,0,1,1,0,1,0,1,1,0,0,1,0,
    1,1,1,1,1,1,1,0,0,1,1,0,1,0,1,0,0,1,0,1,1,
    1,0,0,0,0,0,1,0,1,0,0,1,0,1,1,0,1,1,1,0,0,
    1,0,1,1,1,0,1,0,1,1,0,0,1,0,0,1,0,0,1,1,1,
    1,0,1,1,1,0,1,0,0,0,1,1,0,1,1,0,1,0,1,0,0,
    1,0,1,1,1,0,1,0,1,0,1,0,1,0,0,1,1,1,0,1,1,
    1,0,0,0,0,0,1,0,0,1,1,0,0,1,0,1,0,0,1,0,0,
    1,1,1,1,1,1,1,0,1,0,0,1,1,0,1,1,0,1,1,1,1,
  ]

  return (
    <div className="relative" role="img" aria-label="QR code display at a taco stand">
      {/* Stand/Counter illustration */}
      <div className="relative mx-auto w-[280px]">
        {/* Background - food stand feel */}
        <div className="absolute -inset-4 rounded-2xl bg-gradient-to-b from-amber-900/20 to-amber-800/10" />

        {/* QR Code display */}
        <div className="relative rounded-xl border-2 border-amber-600/30 bg-background p-5 shadow-xl">
          {/* Header */}
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">Maria&apos;s Tacos</p>
            <p className="text-xs text-foreground-muted">Scan to pay</p>
          </div>

          {/* QR Code with centered logo */}
          <div className="relative mx-auto mt-4 flex h-40 w-40 items-center justify-center rounded-lg bg-white p-2">
            <div className="grid h-full w-full grid-cols-[repeat(21,1fr)] grid-rows-[repeat(21,1fr)] gap-[1px]">
              {qrPattern.map((cell, i) => (
                <div
                  key={i}
                  className={cell === 1 ? 'bg-gray-900' : 'bg-white'}
                />
              ))}
            </div>
            {/* Center logo overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white p-1 shadow-sm">
                <div className="flex h-full w-full items-center justify-center rounded bg-gradient-to-br from-yellow-400 to-amber-500">
                  <span className="text-lg font-black text-white">C</span>
                </div>
              </div>
            </div>
          </div>

          {/* Link */}
          <p className="mt-4 text-center text-sm font-medium text-primary">
            cheddarl.ink/mariastacos
          </p>

          {/* Payment icons */}
          <div className="mt-3 flex justify-center gap-2">
            {['V', '$', 'P', 'Z'].map((icon) => (
              <span
                key={icon}
                className="flex h-6 w-6 items-center justify-center rounded bg-background-muted text-xs font-bold text-foreground-muted"
              >
                {icon}
              </span>
            ))}
          </div>
        </div>

        {/* Decorative taco */}
        <div className="absolute -right-6 -top-2 text-3xl" aria-hidden="true">
          🌮
        </div>
      </div>
    </div>
  )
}

// Individual use case card - static, no animations
interface UseCaseProps {
  title: string
  description: string
  highlight: string
  visual: 'social' | 'discord' | 'qr'
  reversed?: boolean
}

function UseCaseCard({ title, description, highlight, visual, reversed }: UseCaseProps) {
  const visualComponent = {
    social: <SocialProfileMockup />,
    discord: <DiscordDMMockup />,
    qr: <QRCodeStandMockup />,
  }[visual]

  return (
    <div
      className={`flex flex-col items-center gap-8 lg:flex-row lg:gap-16 ${
        reversed ? 'lg:flex-row-reverse' : ''
      }`}
    >
      {/* Visual */}
      <div className="flex-1">
        <div className="flex justify-center">
          {visualComponent}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 text-center lg:text-left">
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {highlight}
        </span>
        <h3 className="mt-4 text-2xl font-bold text-foreground lg:text-3xl">
          {title}
        </h3>
        <p className="mt-3 text-foreground-muted">
          {description}
        </p>
      </div>
    </div>
  )
}

// Main showcase export
export function UseCaseShowcase() {
  const useCases: UseCaseProps[] = [
    {
      title: 'Drop it in your bio',
      description:
        'One link that works everywhere. Add your Cheddarl.ink to your social profiles and let followers pay you their way—no more "do you have Venmo?" in the DMs.',
      highlight: 'Social Media',
      visual: 'social',
    },
    {
      title: 'Close deals in DMs',
      description:
        'Selling something on Discord, Reddit, or Twitter? Send your payment link and let buyers choose how to pay. No more back-and-forth about payment apps.',
      highlight: 'Peer-to-Peer',
      visual: 'discord',
      reversed: true,
    },
    {
      title: 'Print it. Post it. Get paid.',
      description:
        'Download your QR code and display it at your food cart, craft booth, or busking spot. Customers scan and pick their favorite payment method.',
      highlight: 'Physical Locations',
      visual: 'qr',
    },
  ]

  return (
    <section className="py-24" aria-labelledby="use-cases-heading">
      <div className="text-center">
        <h2 id="use-cases-heading" className="text-3xl font-bold text-foreground sm:text-4xl">
          One link. Endless possibilities.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-foreground-muted">
          From your Instagram bio to a taco stand—your payment link works everywhere.
        </p>
      </div>

      <div className="mt-20 space-y-24">
        {useCases.map((useCase, index) => (
          <UseCaseCard key={index} {...useCase} />
        ))}
      </div>
    </section>
  )
}
