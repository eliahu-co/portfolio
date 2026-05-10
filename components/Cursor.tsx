'use client'

import { useEffect, useRef } from 'react'

const COLOR     = '#ff6600'
const CLICKABLE = 'a, button, [role="button"], input, select, textarea, label, [tabindex]'

export default function Cursor() {
  const hRef = useRef<HTMLDivElement>(null)
  const vRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const setSize = (size: string) => {
      hRef.current?.style.setProperty('height', size)
      vRef.current?.style.setProperty('width', size)
    }

    const onMove = (e: MouseEvent) => {
      hRef.current?.style.setProperty('transform', `translateY(${e.clientY}px)`)
      vRef.current?.style.setProperty('transform', `translateX(${e.clientX}px)`)
    }

    const onOver = (e: MouseEvent) => {
      const el = e.target as Element | null
      setSize(el?.closest(CLICKABLE) ? '4px' : '2px')
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
      <div ref={hRef} className="fixed inset-x-0 top-0 h-[2px] z-[9999] pointer-events-none" style={{ background: COLOR, willChange: 'transform' }} suppressHydrationWarning />
      <div ref={vRef} className="fixed inset-y-0 left-0 w-[2px] z-[9999] pointer-events-none" style={{ background: COLOR, willChange: 'transform' }} suppressHydrationWarning />
    </>
  )
}
