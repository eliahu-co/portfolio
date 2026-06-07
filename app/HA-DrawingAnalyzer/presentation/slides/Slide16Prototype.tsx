// app/HA-DrawingAnalyzer/presentation/slides/Slide16Prototype.tsx
import { SlideShell } from '../primitives'
import DemoVideo from '@/app/HA-DrawingAnalyzer/sections/DemoVideo'
import { DEMO_HREF } from '../deckData'

export default function Slide16Prototype() {
  return (
    <SlideShell eyebrow="Prototype" title="Change Validation, interactive">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
        <DemoVideo />
        <div className="flex flex-col items-start gap-5">
          <p className="font-sans text-[16px] leading-relaxed text-charcoal">
            A working prototype that simulates the Change Validation flow inside Autodesk Forma.
          </p>
          <a
            href={DEMO_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-sm bg-black px-5 py-3 font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-white no-underline hover:opacity-90"
          >
            Open interactive prototype ↗
          </a>
          <p className="font-sans text-[12px] tracking-[0.06em] text-charcoal/60">eliahu.co/HA-DrawingAnalyzer/demo</p>
        </div>
      </div>
    </SlideShell>
  )
}
