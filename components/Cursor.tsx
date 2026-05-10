'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const hRef = useRef<HTMLDivElement>(null)
  const vRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      hRef.current?.style.setProperty('transform', `translateY(${e.clientY}px)`)
      vRef.current?.style.setProperty('transform', `translateX(${e.clientX}px)`)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      <div ref={hRef} className="fixed inset-x-0 top-0 h-px z-[9999] pointer-events-none" style={{ background: 'rgba(26,26,26,0.18)', willChange: 'transform' }} suppressHydrationWarning />
      <div ref={vRef} className="fixed inset-y-0 left-0 w-px z-[9999] pointer-events-none" style={{ background: 'rgba(26,26,26,0.18)', willChange: 'transform' }} suppressHydrationWarning />
    </>
  )
}
