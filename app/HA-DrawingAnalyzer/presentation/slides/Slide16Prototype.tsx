// app/HA-DrawingAnalyzer/presentation/slides/Slide16Prototype.tsx
import { SlideShell } from '../primitives'
import DemoVideo from '@/app/HA-DrawingAnalyzer/sections/DemoVideo'
import { DEMO_HREF } from '../deckData'

export default function Slide16Prototype() {
  return (
    <SlideShell eyebrow="Prototype" title="Change Validation, interactive">
      <div className="flex flex-col items-start gap-6">
        <div className="w-full max-w-5xl">
          <DemoVideo />
        </div>
        <a
          href={DEMO_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-none bg-black px-5 py-3 font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-white no-underline hover:opacity-90"
        >
          Open interactive prototype ↗
        </a>
      </div>
    </SlideShell>
  )
}
