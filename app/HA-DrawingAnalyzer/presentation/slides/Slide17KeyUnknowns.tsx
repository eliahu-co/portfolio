// app/HA-DrawingAnalyzer/presentation/slides/Slide17KeyUnknowns.tsx
'use client'

import { useEffect, useState } from 'react'
import { SlideShell } from '../primitives'
import { VARIABLES } from '../deckData'

// Monochrome icons per unknown (kept black to stay on-brand).
const ICONS: Record<string, JSX.Element> = {
  Accuracy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <circle cx="10" cy="14" r="7.5" />
      <circle cx="10" cy="14" r="3" />
      <path d="M21 3 L10 14" />
      <path d="M10 9.5 V14 H14.5" />
    </svg>
  ),
  Latency: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <circle cx="12" cy="13" r="8.5" />
      <path d="M12 8 V13 L15.5 15" />
      <path d="M9 2 H15" />
    </svg>
  ),
  Cost: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M12 3 V21" />
      <path d="M16.5 6.5 C16.5 4.5 14.4 3.5 12 3.5 C9.6 3.5 7.5 4.6 7.5 6.8 C7.5 9 9.6 10 12 10.5 C14.4 11 16.5 12 16.5 14.2 C16.5 16.4 14.4 17.5 12 17.5 C9.6 17.5 7.5 16.5 7.5 14.5" />
    </svg>
  ),
}

export default function Slide17KeyUnknowns() {
  // Clicking "validate" in the title reveals the failure modes under each unknown.
  const [revealed, setRevealed] = useState(false)
  // reset the reveal whenever the deck navigates away/back
  useEffect(() => {
    const reset = () => setRevealed(false)
    window.addEventListener('deck:navigate', reset)
    return () => window.removeEventListener('deck:navigate', reset)
  }, [])

  return (
    <SlideShell eyebrow="Feasibility">
      <h2 className="mb-8 text-[clamp(34px,5vw,64px)] font-extrabold leading-[1.04] tracking-[-0.01em] text-black">
        Key unknowns to{' '}
        <span
          role="button"
          tabIndex={0}
          onClick={() => setRevealed((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setRevealed((v) => !v)
            }
          }}
          aria-pressed={revealed}
          className="font-extrabold leading-[1.04] tracking-[-0.01em] text-black"
        >
          validate
        </span>
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {VARIABLES.map(({ label, body, failures }) => (
          <div key={label}>
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-black" aria-hidden="true">{ICONS[label]}</span>
              <p className="text-[24px] font-bold leading-none text-black">{label}</p>
            </div>
            <p className="mt-3 pl-9 font-sans text-[15px] leading-relaxed text-charcoal">{body}</p>
            <div
              className={`mt-4 pl-9 transition-opacity duration-300 ${revealed ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
              aria-hidden={!revealed}
            >
              <div className="flex flex-wrap gap-1.5">
                {failures.map((f) => (
                  <span key={f} className="rounded-none bg-black px-2 py-0.5 font-sans text-[11px] font-semibold text-white">{f}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SlideShell>
  )
}
