'use client'

import { useEffect, useRef, useState } from 'react'
import { MOBILE_BREAKPOINT } from '@/lib/tokens'

// ── Public helpers ────────────────────────────────────────────────────────────

export function showTooltip(label: string, mode: 'cursor' | 'below-center' = 'cursor') {
  window.dispatchEvent(new CustomEvent('tooltip:show', { detail: { label, mode } }))
}

export function hideTooltip() {
  window.dispatchEvent(new CustomEvent('tooltip:hide'))
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Tooltip() {
  const [label, setLabel] = useState<string | null>(null)
  const [mode,  setMode]  = useState<'cursor' | 'below-center'>('cursor')
  const [pos,   setPos]   = useState({ x: 0, y: 0 })
  const divRef     = useRef<HTMLDivElement>(null)
  const labelRef   = useRef<string | null>(null)

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => { setIsMobile(window.innerWidth < MOBILE_BREAKPOINT) }, [])

  useEffect(() => {
    const onShow = (e: Event) => {
      const { label: l, mode: m } = (e as CustomEvent<{ label: string; mode?: string }>).detail
      labelRef.current = l
      setLabel(l)
      setMode((m as 'cursor' | 'below-center') ?? 'cursor')
    }
    const onHide = () => { labelRef.current = null; setLabel(null) }
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    const onClick = () => { if (labelRef.current?.toUpperCase().includes('CLICK')) { labelRef.current = null; setLabel(null) } }

    window.addEventListener('tooltip:show', onShow)
    window.addEventListener('tooltip:hide', onHide)
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('tooltip:show', onShow)
      window.removeEventListener('tooltip:hide', onHide)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click', onClick)
    }
  }, [])

  if (isMobile) return null

  if (!label) return null

  const isLong      = label.length > 80
  const renderedW   = divRef.current?.offsetWidth ?? 0
  const flipLeft    = renderedW > 0 && pos.x + 20 + renderedW + 40 > window.innerWidth

  const posStyle = mode === 'below-center'
    ? { left: pos.x, top: pos.y + 52, transform: 'translateX(-50%)' }
    : flipLeft
      ? { right: window.innerWidth - pos.x + 20, top: pos.y + 20 }
      : { left: pos.x + 20, top: pos.y + 20 }

  return (
    <div
      ref={divRef}
      style={{
        position:      'fixed',
        pointerEvents: 'none',
        zIndex:        9998,
        maxWidth:      isLong ? 400 : 200,
        background:    '#0000FF',
        ...posStyle,
      }}
      className="px-3 py-2"
    >
      <p
        className="font-sans text-white leading-relaxed whitespace-pre-wrap"
        style={isLong
          ? { fontSize: '12px', letterSpacing: '0.02em' }
          : { fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase' }}
      >
        {label}
      </p>
    </div>
  )
}
