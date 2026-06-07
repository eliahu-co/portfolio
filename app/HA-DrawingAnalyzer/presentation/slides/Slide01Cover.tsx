// app/HA-DrawingAnalyzer/presentation/slides/Slide01Cover.tsx
import { SlideShell } from '../primitives'

export default function Slide01Cover() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/presentation/cover.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* solid translucent scrim — keeps the dark title legible over the image */}
      <div className="absolute inset-0 bg-white/60" />
      <div className="relative z-10 h-full">
        <SlideShell eyebrow="Autodesk · Product Manager">
          <h1 className="font-serif text-[clamp(40px,7vw,84px)] leading-[1.02] text-black">AI Drawing Analyzer</h1>
          <p className="mt-4 font-serif text-[clamp(18px,2.4vw,30px)] text-charcoal">Product Opportunities &amp; MVP Recommendation</p>
          <p className="mt-10 font-sans text-[14px] uppercase tracking-[0.12em] text-charcoal/60">Eliahu Cohen</p>
        </SlideShell>
      </div>
    </div>
  )
}
