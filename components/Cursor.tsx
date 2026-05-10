'use client'

import { useEffect, useRef } from 'react'

const COLOR_DEFAULT   = '#ff6600'
const COLOR_CLICKABLE = '#22c55e'

const CLICKABLE = 'a, button, [role="button"], input, select, textarea, label, [tabindex]'

export default function Cursor() {
  const hRef = useRef<HTMLDivElement>(null)
  const vRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const setStyle = (color: string, size: string) => {
      hRef.current?.style.setProperty('background', color)
      hRef.current?.style.setProperty('height', size)
      vRef.current?.style.setProperty('background', color)
      vRef.current?.style.setProperty('width', size)
    }

    const onMove = (e: MouseEvent) => {
      hRef.current?.style.setProperty('transform', `translateY(${e.clientY}px)`)
      vRef.current?.style.setProperty('transform', `translateX(${e.clientX}px)`)
    }

    const onOver = (e: MouseEvent) => {
      const el = e.target as Element | null
      el?.closest(CLICKABLE)
        ? setStyle(COLOR_CLICKABLE, '4px')
        : setStyle(COLOR_DEFAULT, '2px')
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
    }
  }, [])

  return (
    <>
      <div ref={hRef} className="fixed inset-x-0 top-0 h-[2px] z-[9999] pointer-events-none" style={{ background: COLOR_DEFAULT, willChange: 'transform' }} suppressHydrationWarning />
      <div ref={vRef} className="fixed inset-y-0 left-0 w-[2px] z-[9999] pointer-events-none" style={{ background: COLOR_DEFAULT, willChange: 'transform' }} suppressHydrationWarning />
    </>
  )
}
