// app/MA-HomeAssignment/sections/Hero.tsx
// Section 1 — Hero / Intro. Coin Master–styled full-bleed violet banner:
// gold chunky display title (Lilita One), crimson drop shadow, light lavender
// body text. Content strings are identical to the HA-DrawingAnalyzer original.

import { Lilita_One } from 'next/font/google'

const lilita = Lilita_One({ subsets: ['latin'], weight: '400', display: 'swap' })

const CAPABILITIES: { useCase: string; user: string }[] = [
  { useCase: 'Change Validation',          user: 'Designer' },
  { useCase: 'Context Link',               user: 'Field Team' },
  { useCase: 'Coordination Lock',          user: 'BIM/VDC' },
  { useCase: 'Program Conformance Review', user: 'Owner' },
]

export default function Hero() {
  return (
    <section
      id="hero"
      className="scroll-mt-8 bg-gradient-to-br from-cm-violet-deep via-cm-violet to-[#4A1E7A]"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 pt-12 pb-14">
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

        <div className="border-t-2 border-cm-gold/40 pt-3 max-w-2xl">
          <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-[#EDE6FF] border-b-2 border-cm-gold/40 pb-3">
            Eliahu Cohen
            <span className="text-[#B9A8E8]">
              <span className="mx-2">·</span>
              <a href="tel:+972528901495" className="no-underline text-[#B9A8E8] hover:text-cm-gold-bright transition-colors">+972 52 8901495</a>
              <span className="mx-2">·</span>
              <a href="mailto:hi@eliahu.co" className="no-underline text-[#B9A8E8] hover:text-cm-gold-bright transition-colors">hi@eliahu.co</a>
            </span>
          </p>
          <p className="font-sans pt-8 text-[15px] leading-relaxed text-[#EDE6FF]">
            The following use cases were selected to represent different points of view across the
            construction lifecycle—from designers and field teams to owners—while spanning multiple
            project phases and workflows. Together they illustrate the breadth of opportunities
            that become possible when construction drawings are transformed from static documents into
            structured, queryable project data.
          </p>

          <table className="w-full border-collapse text-left mt-6">
            <thead>
              <tr className="border-b border-cm-gold/30">
                <th className="font-sans text-[9px] uppercase tracking-[0.12em] text-cm-gold-bright/80 py-2 pr-4">Use case</th>
                <th className="font-sans text-[9px] uppercase tracking-[0.12em] text-cm-gold-bright/80 py-2 pl-4">User</th>
              </tr>
            </thead>
            <tbody>
              {CAPABILITIES.map(({ useCase, user }, i) => (
                <tr key={useCase} className="border-b border-cm-gold/20">
                  <td className="font-sans text-[13px] text-[#EDE6FF] py-2.5 pr-4">
                    <span className="mr-1.5">{i + 1}.</span>{useCase}
                  </td>
                  <td className="font-sans text-[13px] text-[#EDE6FF] py-2.5 pl-4">{user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
