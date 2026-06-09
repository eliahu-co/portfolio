// app/HA-DrawingAnalyzer/presentation/slides/Slide17KeyUnknowns.tsx
'use client'

import { useEffect, useState } from 'react'
import { SlideShell } from '../primitives'
import { VARIABLES, VALIDATION_STEPS } from '../deckData'

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
  // Clicking "validate" reveals the failure modes under each unknown.
  const [revealed, setRevealed] = useState(false)
  // Clicking the "Feasibility" eyebrow reveals the validation roadmap below.
  const [roadmap, setRoadmap] = useState(false)
  // index of the hovered roadmap step (null = none)
  const [hovered, setHovered] = useState<number | null>(null)
  // index of the hovered unknown column (null = none) — focuses it, fades the rest
  const [unknown, setUnknown] = useState<number | null>(null)
  const unknownFocused = unknown !== null

  // reset every transient state whenever the deck navigates away/back
  useEffect(() => {
    const reset = () => {
      setRevealed(false)
      setRoadmap(false)
      setHovered(null)
      setUnknown(null)
    }
    window.addEventListener('deck:navigate', reset)
    return () => window.removeEventListener('deck:navigate', reset)
  }, [])

  // render a description sentence with its key phrase (`em`) in bold black
  const withEmphasis = (body: string, em: string) => {
    const i = body.indexOf(em)
    if (i === -1) return body
    return (
      <>
        {body.slice(0, i)}
        <strong className="font-semibold text-black">{em}</strong>
        {body.slice(i + em.length)}
      </>
    )
  }

  const toggle = (set: (fn: (v: boolean) => boolean) => void) => ({
    onClick: () => set((v) => !v),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        set((v) => !v)
      }
    },
  })

  return (
    <SlideShell>
      {/* eyebrow — clicking it toggles the validation roadmap (stays clickable while faded) */}
      <p className={`mb-4 transition-opacity duration-300 ${roadmap ? 'opacity-[0.16]' : ''}`}>
        <span
          role="button"
          tabIndex={0}
          aria-pressed={roadmap}
          {...toggle(setRoadmap)}
          className="font-sans text-[12px] font-bold uppercase tracking-[0.14em] text-black"
        >
          Feasibility
        </span>
      </p>

      {/* title + columns — fade out and go inert while the roadmap is shown */}
      <div className={`transition-opacity duration-300 ${roadmap ? 'pointer-events-none opacity-[0.16]' : ''}`}>
        <h2 className="mb-8 text-[clamp(34px,5vw,64px)] font-extrabold leading-[1.04] tracking-[-0.01em] text-black">
          Key unknowns to{' '}
          <span
            role="button"
            tabIndex={0}
            aria-pressed={revealed}
            {...toggle(setRevealed)}
            className="font-extrabold leading-[1.04] tracking-[-0.01em] text-black"
          >
            validate
          </span>
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {VARIABLES.map(({ label, alt, body, failures }, i) => (
            <div
              key={label}
              onMouseEnter={() => setUnknown(i)}
              onMouseLeave={() => setUnknown(null)}
              className={`transition-opacity duration-300 ${unknownFocused && unknown !== i ? 'opacity-20' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className="shrink-0 text-black" aria-hidden="true">{ICONS[label]}</span>
                <p className="text-[24px] font-bold leading-none text-black">{unknown === i ? alt : label}</p>
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
      </div>

      {/* validation roadmap — revealed below the (faded) columns */}
      <div
        className={`mt-10 border-t border-charcoal/15 pt-8 transition-opacity duration-300 ${roadmap ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        aria-hidden={!roadmap}
      >
        <div className="flex flex-nowrap items-center justify-center gap-1">
          {VALIDATION_STEPS.map((s, i) => (
            <span key={s.title} className="flex items-center gap-1">
              <span
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{ backgroundColor: hovered === i ? '#ffff00' : undefined }}
                className="whitespace-nowrap px-2 py-1.5 font-sans text-[13px] font-bold uppercase tracking-[0.04em] text-black"
              >
                {s.title}
              </span>
              {i < VALIDATION_STEPS.length - 1 && <span className="shrink-0 text-[13px] text-black" aria-hidden="true">→</span>}
            </span>
          ))}
        </div>
        <p className="mx-auto mt-5 min-h-[2.75rem] max-w-[640px] text-center font-sans text-[16px] leading-relaxed text-charcoal">
          {hovered !== null ? withEmphasis(VALIDATION_STEPS[hovered].body, VALIDATION_STEPS[hovered].em) : ''}
        </p>
      </div>
    </SlideShell>
  )
}
