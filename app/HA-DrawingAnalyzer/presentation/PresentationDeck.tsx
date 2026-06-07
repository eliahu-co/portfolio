// app/HA-DrawingAnalyzer/presentation/PresentationDeck.tsx
'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { TOTAL_SLIDES, step as stepIndex, hashForIndex, indexFromHash } from './nav'
import { Counter } from './primitives'
import { USE_CASES } from './deckData'
import Slide01Cover from './slides/Slide01Cover'
import Slide02AboutMe from './slides/Slide02AboutMe'
import Slide03Approach from './slides/Slide03Approach'
import Slide04SelectedUseCases from './slides/Slide04SelectedUseCases'
import SlideUseCase from './slides/SlideUseCase'
import Slide09Assumptions from './slides/Slide09Assumptions'
import Slide10Framework from './slides/Slide10Framework'
import Slide11Results from './slides/Slide11Results'
import Slide12Recommendation from './slides/Slide12Recommendation'
import Slide13Workflow from './slides/Slide13Workflow'
import Slide14ValueRisks from './slides/Slide14ValueRisks'
import Slide15MvpScope from './slides/Slide15MvpScope'
import Slide16Prototype from './slides/Slide16Prototype'
import Slide17KeyUnknowns from './slides/Slide17KeyUnknowns'

const SLIDES: ReactNode[] = [
  <Slide01Cover key="1" />,
  <Slide02AboutMe key="2" />,
  <Slide03Approach key="3" />,
  <Slide04SelectedUseCases key="4" />,
  <SlideUseCase key="5" data={USE_CASES[0]} index={1} />,
  <SlideUseCase key="6" data={USE_CASES[1]} index={2} />,
  <SlideUseCase key="7" data={USE_CASES[2]} index={3} />,
  <SlideUseCase key="8" data={USE_CASES[3]} index={4} />,
  <Slide09Assumptions key="9" />,
  <Slide10Framework key="10" />,
  <Slide11Results key="11" />,
  <Slide12Recommendation key="12" />,
  <Slide13Workflow key="13" />,
  <Slide14ValueRisks key="14" />,
  <Slide15MvpScope key="15" />,
  <Slide16Prototype key="16" />,
  <Slide17KeyUnknowns key="17" />,
]

export default function PresentationDeck() {
  const router = useRouter()
  const total = TOTAL_SLIDES
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const fromHash = indexFromHash(window.location.hash, total)
    if (fromHash !== null) setCurrent(fromHash)
  }, [total])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && /^(VIDEO|BUTTON|A|INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return
      if (e.key === 'ArrowRight' || (e.key === ' ' && !e.shiftKey)) {
        e.preventDefault(); setCurrent((c) => stepIndex(c, 1, total))
      } else if (e.key === 'ArrowLeft' || (e.key === ' ' && e.shiftKey)) {
        e.preventDefault(); setCurrent((c) => stepIndex(c, -1, total))
      } else if (e.key === 'Escape') {
        router.push('/HA-DrawingAnalyzer')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [router, total])

  useEffect(() => {
    window.history.replaceState(null, '', hashForIndex(current))
  }, [current])

  return (
    <div className="deck-root bg-white text-charcoal">
      {/* Desktop: crossfading overlay */}
      <div className="deck-overlay hidden lg:block">
        <div className="fixed inset-0 overflow-hidden bg-white">
          {SLIDES.map((slide, i) => (
            <section
              key={i}
              id={`slide-${i + 1}`}
              aria-hidden={i !== current}
              className={`absolute inset-0 bg-white transition-opacity duration-[250ms] ${
                i === current ? 'z-10 opacity-100' : 'z-0 pointer-events-none opacity-0'
              }`}
            >
              {slide}
            </section>
          ))}
          <Counter index={current} total={total} />
        </div>
      </div>

      {/* Mobile: desktop-only notice (mirrors the demo) */}
      <div className="deck-mobile lg:hidden min-h-screen bg-white text-[#1a1a1a] grid place-items-center px-8 text-center">
        <div className="flex flex-col items-center gap-6">
          <p className="font-sans text-[15px] leading-relaxed text-[#5a5a5a]">
            The presentation is only available on desktop.
          </p>
          <a
            href="/HA-DrawingAnalyzer"
            className="font-sans text-[11px] uppercase tracking-[0.06em] no-underline border-2 border-autodesk-blue/60 text-autodesk-blue rounded-sm px-3.5 py-2 hover:bg-autodesk-blue/10 hover:border-autodesk-blue transition-colors"
          >
            ← Home assignment
          </a>
        </div>
      </div>

      {/* Print only: linear stack of all slides (clean PDF) */}
      <div className="deck-print">
        {SLIDES.map((slide, i) => (
          <section key={i} className="flex min-h-screen w-full bg-white">
            {slide}
          </section>
        ))}
      </div>

      <style>{`
        .deck-root, .deck-root * { font-family: var(--font-deck), system-ui, sans-serif !important; }
        .deck-root, .deck-root * { cursor: auto !important; }
        .deck-root a, .deck-root button { cursor: pointer !important; }
        .deck-print { display: none; }
        @media print {
          .deck-overlay { display: none !important; }
          .deck-mobile { display: none !important; }
          .deck-print { display: block !important; }
          .deck-counter { display: none !important; }
          .deck-root .deck-print section { break-after: page; min-height: 100vh; }
        }
      `}</style>
    </div>
  )
}
