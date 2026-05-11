'use client'

import { useEffect, useRef } from 'react'

const COLOR     = '#0000FF'
const CLICKABLE = 'a, button, [role="button"], input, select, textarea, label, [tabindex]'
const ARM       = 20   // px from cursor centre to tip of each arm

export default function Cursor() {
  const hRef = useRef<HTMLDivElement>(null)
  const vRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const setThickness = (size: string) => {
      hRef.current?.style.setProperty('height', size)
      vRef.current?.style.setProperty('width', size)
    }

    const onMove = (e: MouseEvent) => {
      hRef.current?.style.setProperty('transform', `translate(${e.clientX - ARM}px, ${e.clientY - 1.5}px)`)
      vRef.current?.style.setProperty('transform', `translate(${e.clientX - 1.5}px, ${e.clientY - ARM}px)`)
    }

    const onOver = (e: MouseEvent) => {
      const el = e.target as Element | null
      setThickness(el?.closest(CLICKABLE) ? '5px' : '3px')
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
      <div
        ref={hRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ width: `${ARM * 2}px`, height: '3px', background: COLOR, willChange: 'transform' }}
        suppressHydrationWarning
      />
      <div
        ref={vRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ width: '3px', height: `${ARM * 2}px`, background: COLOR, willChange: 'transform' }}
        suppressHydrationWarning
      />
    </>
  )
}
