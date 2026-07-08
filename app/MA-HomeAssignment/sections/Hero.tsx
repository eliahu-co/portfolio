// app/MA-HomeAssignment/sections/Hero.tsx
// Section 1 — Hero / Intro. A Coin Master deep-blue header band (gold Lilita
// One title, crimson drop shadow) that ends under the contact line; the core
// loop diagram, intro paragraph, and use-case table sit below on the cream
// page. Content strings are identical to the HA-DrawingAnalyzer original.

import { Lilita_One } from 'next/font/google'
import CoreLoopDiagram from './CoreLoopDiagram'

const lilita = Lilita_One({ subsets: ['latin'], weight: '400', display: 'swap' })

const CAPABILITIES: { useCase: string; user: string }[] = [
  { useCase: 'Change Validation',          user: 'Designer' },
  { useCase: 'Context Link',               user: 'Field Team' },
  { useCase: 'Coordination Lock',          user: 'BIM/VDC' },
  { useCase: 'Program Conformance Review', user: 'Owner' },
]

export default function Hero() {
  return (
    <section id="hero" className="scroll-mt-8">
      {/* Blue Coin Master header band — full-bleed, ends under the contact line */}
      <div className="bg-gradient-to-br from-[#040b55] via-[#12105c] to-[#0d335a]">
        {/* mirrors the body's sidebar grid so the text lines up with the sections below */}
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 pt-12 pb-8 md:grid md:grid-cols-[180px_1fr] md:gap-16">
        <div className="hidden md:block" aria-hidden="true" />
        <div className="min-w-0">
        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-cm-gold-bright mb-4">
          Product Manager · Home Assignment
        </p>

        <h1
          className={`${lilita.className} text-[clamp(34px,5.5vw,56px)] leading-[1.02] text-cm-gold-bright mb-6 [text-shadow:0_3px_0_#B7202E,0_5px_12px_rgba(0,0,0,0.35)]`}
        >
          AI Drawing Analyzer
          <span className="block font-sans font-normal text-[clamp(14px,1.8vw,18px)] text-[#EDE6FF] mt-2 [text-shadow:none]">
            Autodesk Construction Solutions
          </span>
        </h1>

        <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-[#EDE6FF] border-t-2 border-cm-gold/40 pt-3 max-w-2xl flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <span>Eliahu Cohen</span>
          <a href="tel:+972528901495" className="no-underline text-[#B9A8E8] hover:text-cm-gold-bright transition-colors">+972 52 8901495</a>
          <a href="mailto:hi@eliahu.co" className="no-underline text-[#B9A8E8] hover:text-cm-gold-bright transition-colors">hi@eliahu.co</a>
        </p>
        </div>
        </div>
      </div>

      {/* Content on the cream page background, aligned to the same grid */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 pt-8 md:grid md:grid-cols-[180px_1fr] md:gap-16">
        <div className="hidden md:block" aria-hidden="true" />
        <div className="min-w-0 max-w-2xl">
          <CoreLoopDiagram />

          <p className="font-sans pt-8 text-[15px] leading-relaxed text-charcoal">
            The following use cases were selected to represent different points of view across the
            construction lifecycle—from designers and field teams to owners—while spanning multiple
            project phases and workflows. Together they illustrate the breadth of opportunities
            that become possible when construction drawings are transformed from static documents into
            structured, queryable project data.
          </p>

          <table className="w-full border-collapse text-left mt-6">
            <thead>
              <tr className="border-b border-charcoal/15">
                <th className="font-sans text-[9px] uppercase tracking-[0.12em] text-charcoal/70 py-2 pr-4">Use case</th>
                <th className="font-sans text-[9px] uppercase tracking-[0.12em] text-charcoal/70 py-2 pl-4">User</th>
              </tr>
            </thead>
            <tbody>
              {CAPABILITIES.map(({ useCase, user }, i) => (
                <tr key={useCase} className="border-b border-charcoal/15">
                  <td className="font-sans text-[13px] text-charcoal py-2.5 pr-4">
                    <span className="mr-1.5">{i + 1}.</span>{useCase}
                  </td>
                  <td className="font-sans text-[13px] text-charcoal py-2.5 pl-4">{user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
