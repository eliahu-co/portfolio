// app/HA-DrawingAnalyzer/presentation/slides/Slide01Cover.tsx
import { SlideShell } from '../primitives'

export default function Slide01Cover() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/presentation/cover.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover grayscale"
      />
      {/* translucent Hello Yellow overlay — duotone with the grayscale image, keeps the black title legible */}
      <div className="absolute inset-0 bg-[#ffff00]/95" />
      <div className="relative z-10 h-full">
        <SlideShell eyebrow="Autodesk · Product Manager" variant="centered">
          <h1 className="font-extrabold text-[clamp(40px,7vw,84px)] leading-[1.02] text-black">AI Drawing Analyzer</h1>
          <p className="mt-4 text-[clamp(18px,2.4vw,30px)] font-medium text-black">Product Opportunities &amp; MVP Recommendation</p>
          <p className="mt-5 font-sans text-[12px] font-bold uppercase tracking-[0.14em] text-black">Eliahu Cohen</p>
        </SlideShell>
      </div>
    </div>
  )
}
