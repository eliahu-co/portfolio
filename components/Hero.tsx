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
      <div className="absolute bottom-8 left-8 md:left-16 lg:left-24 z-10 flex flex-col items-start pointer-events-none">
        <svg
          className="animate-bounce-y w-14 h-14"
          viewBox="0 0 32 32"
          fill="none"
          stroke="#B57F59"
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
