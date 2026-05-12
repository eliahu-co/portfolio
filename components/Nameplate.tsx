'use client'

import { useEffect, useRef, useState } from 'react'
import { CONTACT_LINKS } from '@/lib/site-data'
import { MOBILE_BREAKPOINT } from '@/lib/tokens'

// Mini-nameplate geometry constants
const SCALE      = 0.55
const LEFT_8     = 32
const TOP_6      = 24
const NAV_H      = 44
const NAV_BOTTOM = 24

export default function Nameplate() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hidden,   setHidden]   = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [shrunk,   setShrunk]   = useState(false)
  const [atTop,    setAtTop]    = useState(true)
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

  // Track whether the page is at the very top (mobile only)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const onScroll = () => setAtTop(window.scrollY < window.innerHeight * 0.5)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Mobile detect + compute shrink transform
  useEffect(() => {
    const mobile = window.innerWidth < MOBILE_BREAKPOINT
    setIsMobile(mobile)
    if (!mobile) return

    const update = () => {
      const miniH        = 42 * SCALE
      const navTop       = NAV_BOTTOM + NAV_H
      const gap          = 10
      const miniBottomFB = navTop + gap
      const miniTopFB    = miniBottomFB + miniH
      const ty           = window.innerHeight - miniTopFB - TOP_6
      const W            = containerRef.current?.offsetWidth ?? 300
      const tx           = window.innerWidth / 2 - (W * SCALE) / 2 - LEFT_8
      setShrinkXY({ x: Math.round(tx), y: Math.round(ty) })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Shrink when #what-i-do enters view; un-shrink only when hero comes back
  useEffect(() => {
    if (!isMobile) return
    const whatIDo = document.getElementById('what-i-do')
    const hero    = document.getElementById('hero')
    if (!whatIDo || !hero) return

    const shrinkObs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setShrunk(true) },
      { threshold: 0.1 }
    )
    const unshrinkObs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setShrunk(false) },
      { threshold: 0.1 }
    )
    shrinkObs.observe(whatIDo)
    unshrinkObs.observe(hero)
    return () => { shrinkObs.disconnect(); unshrinkObs.disconnect() }
  }, [isMobile])

  const mobileShrunk = isMobile && shrunk
  // On mobile: visible only at the very top OR when in the mini position
  const mobileVisible = !isMobile || atTop || mobileShrunk

  return (
    <div
      ref={containerRef}
      className="fixed top-6 z-50 left-8 md:left-16 lg:left-24 select-none"
      data-overlay-hide
      style={{
        transformOrigin: 'left top',
        // Apply mini position instantly (no slide animation) — only opacity transitions
        transform: mobileShrunk
          ? `translate(${shrinkXY.x}px, ${shrinkXY.y}px) scale(${SCALE})`
          : 'none',
        opacity:      mobileVisible ? 1 : 0,
        pointerEvents: (!mobileVisible || mobileShrunk) ? 'none' : undefined,
        transition:   mobileShrunk ? 'none' : 'opacity 0.25s',
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
        {CONTACT_LINKS.filter(({ mobileOnly }) => !mobileOnly || isMobile).map(({ label, href, download, external }) => (
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
