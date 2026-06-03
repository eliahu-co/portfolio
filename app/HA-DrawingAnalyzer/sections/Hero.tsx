// app/HA-DrawingAnalyzer/sections/Hero.tsx
// Section 1 — Hero / Intro. Title, subtitle, author, summary, back-home link.

export default function Hero() {
  return (
    <section id="hero" className="scroll-mt-8 pt-2 pb-16">
      <p className="font-sans text-[9px] uppercase tracking-[0.14em] text-autodesk-blue mb-4">
        Product Strategy · Home Assignment
      </p>

      <h1 className="font-serif text-[clamp(34px,6vw,64px)] leading-[1.05] text-black mb-4">
        AI Drawing Analyzer
        <span className="block text-charcoal">Product Strategy</span>
      </h1>

      <p className="font-sans text-[15px] tracking-[0.02em] text-charcoal mb-8">
        {/* TODO: one-line subtitle / framing of the deliverable */}
        TODO: Subtitle — a one-line framing of what this deliverable argues.
      </p>

      <div className="border-t-2 border-charcoal/20 pt-6 max-w-2xl">
        <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal mb-3">
          Eliahu Cohen
        </p>
        <p className="font-sans text-[15px] leading-relaxed text-charcoal">
          {/* TODO: 2–3 sentence summary of the thesis and how the page is structured. */}
          TODO: Summary paragraph — what the AI Drawing Analyzer is, why it matters,
          and what this walkthrough covers. Keep it to a few sentences.
        </p>

        <a
          href="/"
          className="inline-block mt-6 font-sans text-[10px] uppercase tracking-[0.12em] text-charcoal/70 hover:text-autodesk-blue transition-colors no-underline"
        >
          ← Back to portfolio
        </a>
      </div>
    </section>
  )
}
