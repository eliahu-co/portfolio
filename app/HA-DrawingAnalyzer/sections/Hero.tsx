// app/HA-DrawingAnalyzer/sections/Hero.tsx
// Section 1 — Hero / Intro. Title, subtitle, author, summary, back-home link.

const CAPABILITIES: { useCase: string; user: string }[] = [
  { useCase: 'Change Validation',          user: 'Designer' },
  { useCase: 'Context Link',               user: 'Field Team' },
  { useCase: 'Coordination Lock',          user: 'BIM/VDC' },
  { useCase: 'Program Conformance Review', user: 'Owner' },
]

export default function Hero() {
  return (
    <section id="hero" className="scroll-mt-8 pt-2 pb-16">
      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-autodesk-blue mb-4">
        Product Manager · Home Assignment
      </p>

      <h1 className="font-serif text-[clamp(30px,5vw,48px)] leading-[1.05] text-black mb-4">
        AI Drawing Analyzer
        <span className="block text-[clamp(14px,1.8vw,18px)] text-charcoal mt-1">Autodesk Construction Solutions</span>
      </h1>

      <div className="border-t-2 border-charcoal/20 pt-6 max-w-2xl">
        <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal mb-3">
          Eliahu Cohen
          <span className="text-charcoal/45">
            <span className="mx-2">·</span>
            <a href="tel:+972528901495" className="no-underline text-charcoal/45 hover:text-autodesk-blue transition-colors">+972 52 8901495</a>
            <span className="mx-2">·</span>
            <a href="mailto:hi@eliahu.co" className="no-underline text-charcoal/45 hover:text-autodesk-blue transition-colors">hi@eliahu.co</a>
          </span>
        </p>
        <p className="font-sans text-[15px] leading-relaxed text-charcoal">
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
    </section>
  )
}
