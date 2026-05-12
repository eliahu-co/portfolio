'use client'

import { useEffect, useRef, useState } from 'react'
import { CONTACT_LINKS } from '@/lib/site-data'
import { MOBILE_BREAKPOINT } from '@/lib/tokens'

// Mini-nameplate geometry constants
const SCALE      = 0.55   // visual scale when shrunk beside nav
const LEFT_8     = 32     // left-8 = 2rem = 32px (element's natural left offset)
const TOP_6      = 24     // top-6 = 1.5rem = 24px (element's natural top offset)
const NAV_H      = 44     // float nav estimated height (px)
const NAV_BOTTOM = 24     // float nav bottom-6 = 24px

export default function Nameplate() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hidden,   setHidden]   = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [shrunk,   setShrunk]   = useState(false)
  const [shrinkXY, setShrinkXY] = useState({ x: -24, y: 0 })

  // Hide subtitle + contacts while work-strip is in view
  useEffect(() => {
    const el = document.getElementById('work-strip')
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { rootMargin: '0px 0px -20% 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Mobile detect + compute shrink transform
  useEffect(() => {
    const mobile = window.innerWidth < MOBILE_BREAKPOINT
    setIsMobile(mobile)
    if (!mobile) return

    const update = () => {
      // Vertical: position bottom of mini text 10px above the float nav's top edge
      const miniH       = 42 * SCALE
      const navTop      = NAV_BOTTOM + NAV_H              // 68px from bottom
      const gap         = 10
      const miniBottomFB = navTop + gap                   // 78px from bottom
      const miniTopFB   = miniBottomFB + miniH            // ~101px from bottom
      const ty          = window.innerHeight - miniTopFB - TOP_6

      // Horizontal: align the visual center of the mini text with the nav's center (window.innerWidth / 2).
      // Visual left = LEFT_8 + tx; visual width = W * SCALE.
      const W  = containerRef.current?.offsetWidth ?? 300
      const tx = window.innerWidth / 2 - (W * SCALE) / 2 - LEFT_8

      setShrinkXY({ x: Math.round(tx), y: Math.round(ty) })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Shrink when #what-i-do section enters view (mobile only)
  useEffect(() => {
    if (!isMobile) return
    const el = document.getElementById('what-i-do')
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setShrunk(entry.isIntersecting),
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [isMobile])

  const mobileShrunk = isMobile && shrunk

  return (
    <div
      ref={containerRef}
      className="fixed top-6 z-50 left-8 md:left-16 lg:left-24 select-none"
      data-overlay-hide
      style={{
        transformOrigin: 'left top',
        transform: mobileShrunk
          ? `translate(${shrinkXY.x}px, ${shrinkXY.y}px) scale(${SCALE})`
          : 'none',
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <h1 className="text-[42px] leading-none pointer-events-none" style={{ fontFamily: 'var(--font-nabla)' }}>
        Eliahu Cohen
      </h1>

      <p
        className="font-sans text-[10px] uppercase tracking-[0.12em] text-ink mt-2 pointer-events-none"
        style={{
          opacity:    (hidden || mobileShrunk) ? 0 : 1,
          transform:  hidden ? 'translateY(-8px)' : 'translateY(0)',
          transition: 'opacity 0.2s, transform 0.2s',
        }}
      >
        AEC Architect. Software Developer. Builder.
      </p>

      {/* Contact links — hide when work-strip is in view or nameplate is shrunk */}
      <div
        className="flex flex-col gap-1 mt-3 items-start"
        style={{
          opacity:       (hidden || mobileShrunk) ? 0 : 1,
          transform:     hidden ? 'translateY(-8px)' : 'translateY(0)',
          transition:    'opacity 0.2s, transform 0.2s',
          pointerEvents: (hidden || mobileShrunk) ? 'none' : 'auto',
        }}
      >
        {CONTACT_LINKS.map(({ label, href, download, external }) => (
          <a
            key={href}
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            {...(download ? { download: true } : {})}
            className="font-sans text-[10px] uppercase tracking-[0.12em] text-ink transition-colors duration-200"
            style={{
              background:   'var(--color-gray-ui)',
              border:       'var(--border)',
              borderRadius: '2px',
              boxShadow:    'var(--shadow-card)',
              padding:      '6px 12px',
              display:      'inline-block',
            }}
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  )
}
