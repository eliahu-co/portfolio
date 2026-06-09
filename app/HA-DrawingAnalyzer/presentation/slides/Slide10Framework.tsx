// app/HA-DrawingAnalyzer/presentation/slides/Slide10Framework.tsx
'use client'

import { useState } from 'react'
import { SlideShell } from '../primitives'
import { CRITERIA_DEFS } from '../deckData'

export default function Slide10Framework() {
  // hovering a criterion card focuses it: the rest fade
  const [hovered, setHovered] = useState<number | null>(null)
  const focused = hovered !== null

  return (
    <SlideShell eyebrow="Prioritization">
      {/* invisible title-sized spacer so the body sits where a big title would put it */}
      <h2 aria-hidden className="mb-8 select-none text-[clamp(34px,5vw,64px)] font-extrabold leading-[1.04]">&nbsp;</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {CRITERIA_DEFS.map(({ title, body, rubric }, i) => (
          <div
            key={title}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className={`border-black transition-opacity duration-300 ${focused && hovered !== i ? 'opacity-20' : ''} ${title === 'Confidence' ? 'border-l-8 pl-3' : 'border-l-4 pl-4'}`}
          >
            <p className="text-[20px] font-bold text-black">{title}</p>
            <p className="mt-1 font-sans text-[13px] italic leading-relaxed text-black">{body}</p>
            <div className="mt-2 flex flex-col gap-0.5">
              {rubric.map(([score, desc]) => (
                <p key={score} className="font-sans text-[13px] leading-relaxed text-black">
                  <span className="font-bold text-black">{score}</span>
                  <span className="text-black"> — </span>{desc}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SlideShell>
  )
}
