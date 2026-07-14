// app/MA-HomeAssignment/sections/Hero.tsx
// Section 1 — Hero header band. A full-bleed band using Coin Master's sky/clouds
// image (public/coinmaster-sky.webp) with the gold display title (Nunito, the
// same face as the section headings), subtitle,
// and the contact line (dark text for readability). The band ends under the
// contact line; the intro content (core-loop diagram, framing paragraph, and
// use-case table) lives in Intro.tsx in the main column, so the sidebar nav can
// sit directly beneath this band. Content is specific to this assignment.

export default function Hero() {
  return (
    <section
      id="top"
      className="scroll-mt-8 bg-cm-cream bg-[url('/coinmaster-sky.webp')] bg-cover bg-bottom bg-no-repeat"
    >
      {/* The sky image fades to transparent toward the bottom, so the cream page
          colour behind it shows through and the clouds dissolve into the warm white. */}
      {/* mirrors the body's sidebar grid so the title lines up with the content below */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 pt-12 pb-9 md:grid md:grid-cols-[180px_1fr] md:gap-16">
        <div className="hidden md:block" aria-hidden="true" />
        <div className="relative min-w-0 text-center md:text-left">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-[#0F3D54] mb-4">
            Product Manager · Home Assignment
          </p>
          {/* Coin Master logo — mobile only: below the eyebrow, above the title */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/coinmaster/coinmaster-logo.webp"
            alt="Coin Master"
            data-hero-logo="mobile"
            className="pointer-events-none block md:hidden drop-shadow-lg mb-4 mx-auto"
            style={{ height: 120, width: 'auto' }}
          />

          <div className="relative mb-6" data-hero-title-row="true">
            <h1
              className="text-[clamp(24px,4.6vw,46px)] whitespace-nowrap leading-[1.02] tracking-[-0.01em] text-cm-violet-deep"
              style={{
                // same display face + colour as the concept/section headings
                fontFamily: 'var(--font-cm-display), "Nunito", ui-rounded, sans-serif',
                fontWeight: 900,
              }}
            >
              Increasing ARPDAU
            </h1>
            {/* Coin Master logo at the right edge of the title row — desktop only. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/coinmaster/coinmaster-logo.webp"
              alt="Coin Master"
              data-hero-logo="desktop"
              className="pointer-events-none absolute right-[60px] top-[calc(50%_-_6px)] hidden h-[clamp(80px,10vw,112px)] w-auto -translate-y-1/2 drop-shadow-lg md:block"
            />
          </div>

          <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-[#0F3D54] border-t-2 border-[#0F3D54]/25 pt-3 max-w-2xl flex flex-wrap items-baseline justify-center md:justify-between gap-x-6 gap-y-1">
            <span>Eliahu Cohen</span>
            <a href="tel:+972528901495" className="no-underline text-[#1E7BA8] hover:text-cm-crimson transition-colors">+972 52 8901495</a>
            <a href="mailto:hi@eliahu.co" className="no-underline text-[#1E7BA8] hover:text-cm-crimson transition-colors">hi@eliahu.co</a>
          </p>
        </div>
      </div>
    </section>
  )
}
