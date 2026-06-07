// app/HA-DrawingAnalyzer/presentation/PresentationDeck.tsx
'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'

// Temporary placeholder slides — replaced by real slide components in later tasks.
const SLIDES: ReactNode[] = Array.from({ length: 17 }, (_, i) => (
  <div className="flex h-full w-full items-center justify-center">
    <span className="font-serif text-[64px] text-black">Slide {i + 1}</span>
  </div>
))

export default function PresentationDeck() {
  const router = useRouter()
  const total = SLIDES.length
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && /^(VIDEO|BUTTON|A|INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return
      if (e.key === 'ArrowRight' || (e.key === ' ' && !e.shiftKey)) {
        e.preventDefault(); setCurrent((c) => (c >= total - 1 ? c : c + 1))
      } else if (e.key === 'ArrowLeft' || (e.key === ' ' && e.shiftKey)) {
        e.preventDefault(); setCurrent((c) => (c <= 0 ? c : c - 1))
      } else if (e.key === 'Escape') {
        router.push('/HA-DrawingAnalyzer')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [router, total])

  useEffect(() => {
    window.history.replaceState(null, '', `#slide-${current + 1}`)
  }, [current])

  return (
    <div className="deck-root bg-white text-charcoal">
      {/* Desktop: crossfading overlay */}
      <div className="hidden lg:block">
        <div className="fixed inset-0 overflow-hidden">
          {SLIDES.map((slide, i) => (
            <section
              key={i}
              id={`slide-${i + 1}`}
              aria-hidden={i !== current}
              className={`absolute inset-0 transition-opacity duration-[250ms] ${
                i === current ? 'z-10 opacity-100' : 'z-0 pointer-events-none opacity-0'
              }`}
            >
              {slide}
            </section>
          ))}
          <p className="deck-counter fixed bottom-5 right-6 z-20 font-sans text-[12px] tracking-[0.12em] text-charcoal/60">
            {current + 1} / {total}
          </p>
        </div>
      </div>

      {/* Mobile / print: linear vertical stack */}
      <div className="deck-linear lg:hidden">
        {SLIDES.map((slide, i) => (
          <section key={i} id={`slide-${i + 1}`} className="flex min-h-screen w-full">
            {slide}
          </section>
        ))}
      </div>

      <style>{`
        .deck-root, .deck-root * { cursor: auto; }
        @media print {
          .deck-root .hidden.lg\\:block { display: none !important; }
          .deck-root .deck-linear { display: block !important; }
          .deck-counter { display: none !important; }
          .deck-root section { break-after: page; min-height: 100vh; }
        }
      `}</style>
    </div>
  )
}
