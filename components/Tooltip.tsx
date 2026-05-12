'use client'

import { useEffect, useState } from 'react'
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

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => { setIsMobile(window.innerWidth < MOBILE_BREAKPOINT) }, [])

  useEffect(() => {
    const onShow = (e: Event) => {
      const { label: l, mode: m } = (e as CustomEvent<{ label: string; mode?: string }>).detail
      setLabel(l)
      setMode((m as 'cursor' | 'below-center') ?? 'cursor')
    }
    const onHide = () => setLabel(null)
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })

    window.addEventListener('tooltip:show', onShow)
    window.addEventListener('tooltip:hide', onHide)
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('tooltip:show', onShow)
      window.removeEventListener('tooltip:hide', onHide)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  if (isMobile) return null

  if (!label) return null

  const isLong   = label.length > 80
  const maxWidth  = isLong ? 400 : 200
  const flipLeft  = pos.x + 20 + maxWidth > window.innerWidth

  const posStyle = mode === 'below-center'
    ? { left: pos.x, top: pos.y + 52, transform: 'translateX(-50%)' }
    : flipLeft
      ? { left: pos.x - 20, top: pos.y + 20, transform: 'translateX(-100%)' }
      : { left: pos.x + 20, top: pos.y + 20 }

  return (
    <div
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
