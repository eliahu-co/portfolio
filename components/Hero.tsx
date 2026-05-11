// components/Hero.tsx
'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { showTooltip, hideTooltip } from '@/components/Tooltip'

const PanelScene = dynamic(() => import('./PanelScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0" style={{ background: '#675962' }} />,
})

export default function Hero() {
  const scrolledRef = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      if (!scrolledRef.current && window.scrollY > 0) {
        scrolledRef.current = true
        hideTooltip()
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      id="hero"
      className="relative h-screen w-full overflow-hidden"
      style={{ background: '#675962' }}
      onMouseEnter={() => { if (!scrolledRef.current) showTooltip('Scroll down') }}
      onMouseLeave={hideTooltip}
    >
      {/* Three.js canvas — fills entire section */}
      <PanelScene />

      {/* Scroll CTA */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none">
        <svg
          className="animate-bounce-y w-4 h-4 text-ink/40"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M2 5l6 6 6-6" />
        </svg>
      </div>
    </section>
  )
}
