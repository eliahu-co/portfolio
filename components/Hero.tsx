// components/Hero.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { showTooltip, hideTooltip } from '@/components/Tooltip'
import { MOBILE_BREAKPOINT } from '@/lib/tokens'

const PanelScene = dynamic(() => import('./PanelScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0" style={{ background: '#f5f5f5' }} />,
})

const HERO_TOOLTIP =
  `A building has a stack, components, users, and a PRD. You ship it, it goes live, and someone files a bug.\n\n` +
  `It's not a coincidence you call it a build — whether you're raising a floor plate or a codebase, you need an architect on the team.`

const STALE_DELAY = 2500

export default function Hero() {
  const [scrolled,       setScrolled]       = useState(false)
  const [overlayActive,  setOverlayActive]  = useState(false)
  const [ctaBottom,      setCtaBottom]      = useState<number | null>(null)
  const staleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearStale = () => {
    if (staleTimer.current) { clearTimeout(staleTimer.current); staleTimer.current = null }
  }
  const resetStale = () => {
    clearStale()
    hideTooltip()
    staleTimer.current = setTimeout(() => showTooltip(HERO_TOOLTIP), STALE_DELAY)
  }
  const onHeroLeave = () => { clearStale(); hideTooltip() }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const obs = new MutationObserver(() =>
      setOverlayActive(document.body.classList.contains('overlay-active'))
    )
    obs.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (window.innerWidth >= MOBILE_BREAKPOINT) return
    const measure = () => {
      const nav = document.querySelector('nav')
      if (!nav) return
      const rect = nav.getBoundingClientRect()
      setCtaBottom(Math.round(window.innerHeight - rect.top - 34))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return (
    <section
      id="hero"
      className="relative h-screen w-full overflow-hidden"
      style={{ background: '#f5f5f5', borderBottom: '2px solid var(--color-orange)' }}
      onMouseEnter={resetStale}
      onMouseMove={resetStale}
      onMouseLeave={onHeroLeave}
    >
      {/* Three.js canvas — fills entire section */}
      <PanelScene />

      {/* Scroll CTA */}
      <div
        className="animate-bounce-y absolute bottom-[34px] md:bottom-8 left-8 md:left-16 lg:left-24 z-10 flex flex-col items-center pointer-events-none"
        style={{
          ...(ctaBottom !== null ? { bottom: `${ctaBottom}px` } : {}),
          opacity: overlayActive || scrolled ? 0 : 1,
          transform: scrolled ? 'translateY(8px)' : 'translateY(0)',
          transition: 'opacity 0.2s, transform 0.2s',
        }}
      >
        <div style={{
          width: '34px',
          height: '34px',
          background: 'var(--color-gray-ui)',
          border: 'var(--border)',
          borderRadius: '2px',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 13 13"
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M2 4l4.5 4.5L11 4" />
          </svg>
        </div>
      </div>
    </section>
  )
}
