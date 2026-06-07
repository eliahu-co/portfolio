// app/HA-DrawingAnalyzer/presentation/slides/Slide10Framework.tsx
import { SlideShell } from '../primitives'
import { CRITERIA_DEFS } from '../deckData'

export default function Slide10Framework() {
  return (
    <SlideShell eyebrow="Prioritization" title="Four criteria, scored 1–5">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {CRITERIA_DEFS.map(({ title, body, rubric }) => (
          <div key={title} className="border-l-4 border-charcoal pl-4">
            <p className="text-[20px] font-bold text-black">{title}</p>
            <p className="mt-1 font-sans text-[13px] italic leading-relaxed text-charcoal/80">{body}</p>
            <div className="mt-2 flex flex-col gap-0.5">
              {rubric.map(([score, desc]) => (
                <p key={score} className="font-sans text-[13px] leading-relaxed text-charcoal/70">
                  <span className="font-bold text-charcoal">{score}</span>
                  <span className="text-charcoal/40"> — </span>{desc}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SlideShell>
  )
}
