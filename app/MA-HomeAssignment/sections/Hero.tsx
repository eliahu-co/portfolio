// app/MA-HomeAssignment/sections/Hero.tsx
// Section 1 — Hero header band. A Coin Master deep-blue full-bleed band with the
// gold Lilita One title, subtitle, and the contact line. The band ends under the
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
      className="scroll-mt-8 bg-gradient-to-br from-[#040b55] via-[#12105c] to-[#0d335a]"
    >
      {/* mirrors the body's sidebar grid so the title lines up with the content below */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 pt-12 pb-9 md:grid md:grid-cols-[180px_1fr] md:gap-16">
        <div className="hidden md:block" aria-hidden="true" />
        <div className="min-w-0">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-cm-gold-bright mb-4">
            Product Manager · Home Assignment
          </p>

          <h1
            className={`${lilita.className} text-[clamp(34px,5.5vw,56px)] leading-[1.02] text-cm-gold-bright mb-6 [text-shadow:0_3px_0_#B7202E,0_5px_12px_rgba(0,0,0,0.35)]`}
          >
            AI Drawing Analyzer
          </h1>

          <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-[#EDE6FF] border-t-2 border-cm-gold/40 pt-3 max-w-2xl flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <span>Eliahu Cohen</span>
            <a href="tel:+972528901495" className="no-underline text-[#B9A8E8] hover:text-cm-gold-bright transition-colors">+972 52 8901495</a>
            <a href="mailto:hi@eliahu.co" className="no-underline text-[#B9A8E8] hover:text-cm-gold-bright transition-colors">hi@eliahu.co</a>
          </p>
        </div>
      </div>
    </section>
  )
}
