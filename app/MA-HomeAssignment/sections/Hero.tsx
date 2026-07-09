// app/MA-HomeAssignment/sections/Hero.tsx
// Section 1 — Hero header band. A full-bleed band using Coin Master's sky/clouds
// image (public/coinmaster-sky.webp) with the gold Lilita One title, subtitle,
// and the contact line (dark text for readability). The band ends under the
// contact line; the intro content (core-loop diagram, framing paragraph, and
// use-case table) lives in Intro.tsx in the main column, so the sidebar nav can
// sit directly beneath this band. Content strings match the HA-DrawingAnalyzer
// original.

import { Lilita_One } from 'next/font/google'

const lilita = Lilita_One({ subsets: ['latin'], weight: '400', display: 'swap' })

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
        <div className="min-w-0">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-[#0F3D54] mb-4">
            Product Manager · Home Assignment
          </p>

          <h1
            className={`${lilita.className} text-[clamp(20px,4.2vw,42px)] whitespace-nowrap leading-[1.02] text-cm-gold-bright mb-6 [text-shadow:0_3px_0_#B7202E,0_5px_12px_rgba(0,0,0,0.35)]`}
          >
            <span className="inline-flex items-center gap-2.5 align-middle">
              Increasing ARPDAU
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/coinmaster/coinmaster-logo.webp"
                alt="Coin Master"
                className="inline-block h-[1.5em] w-auto [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.2))]"
              />
            </span>
            <span className="block font-sans font-normal whitespace-normal text-[clamp(14px,1.8vw,18px)] text-[#0F3D54] mt-2 [text-shadow:none]">
              Three feature concepts, one expanded to MVP
            </span>
          </h1>

          <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-[#0F3D54] border-t-2 border-[#0F3D54]/25 pt-3 max-w-2xl flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <span>Eliahu Cohen</span>
            <a href="tel:+972528901495" className="no-underline text-[#1E7BA8] hover:text-cm-crimson transition-colors">+972 52 8901495</a>
            <a href="mailto:hi@eliahu.co" className="no-underline text-[#1E7BA8] hover:text-cm-crimson transition-colors">hi@eliahu.co</a>
          </p>
        </div>
      </div>
    </section>
  )
}
