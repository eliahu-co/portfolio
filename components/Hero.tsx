// components/Hero.tsx
'use client'

import dynamic from 'next/dynamic'
import { showTooltip, hideTooltip } from '@/components/Tooltip'

const PanelScene = dynamic(() => import('./PanelScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0" style={{ background: '#675962' }} />,
})

const HERO_TOOLTIP =
  `A building has a stack, components, users, and a PRD. You ship it, it goes live, and someone files a bug.\n\n` +
  `It's not a coincidence you call it a build — whether you're raising a floor plate or a codebase, you need an architect on the team.`

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative h-screen w-full overflow-hidden"
      style={{ background: '#675962' }}
      onMouseEnter={() => showTooltip(HERO_TOOLTIP)}
      onMouseLeave={hideTooltip}
    >
      {/* Three.js canvas — fills entire section */}
      <PanelScene />

      {/* Scroll CTA */}
      <div className="animate-bounce-y absolute bottom-8 left-8 md:left-16 lg:left-24 z-10 flex flex-col items-center pointer-events-none">
        <span
          className="font-sans uppercase text-center w-14 mb-1"
          style={{ fontSize: '10px', letterSpacing: '0.12em', color: 'var(--color-ink)' }}
        >
          Scroll
        </span>
        <svg
          className="w-14 h-14"
          viewBox="0 0 32 32"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="2.5"
          strokeLinecap="square"
          aria-hidden="true"
        >
          <path d="M4 10l12 12L28 10" />
        </svg>
      </div>
    </section>
  )
}
