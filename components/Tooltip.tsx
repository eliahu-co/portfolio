'use client'

// Global floating tooltip — triggered by custom window events from any component.
//
// Usage in any client component:
//   import { showTooltip, hideTooltip } from '@/components/Tooltip'
//   <div onMouseEnter={() => showTooltip('My label')} onMouseLeave={hideTooltip} />
//
// Render once in page.tsx: <Tooltip />

import { useEffect, useState } from 'react'

// ── Public helpers ────────────────────────────────────────────────────────────

export function showTooltip(label: string) {
  window.dispatchEvent(new CustomEvent('tooltip:show', { detail: { label } }))
}

export function hideTooltip() {
  window.dispatchEvent(new CustomEvent('tooltip:hide'))
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Tooltip() {
  const [label, setLabel] = useState<string | null>(null)
  const [pos,   setPos]   = useState({ x: 0, y: 0 })

  useEffect(() => {
    const onShow = (e: Event) =>
      setLabel((e as CustomEvent<{ label: string }>).detail.label)
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

  if (!label) return null

  const isLong = label.length > 80

  return (
    <div
      style={{
        position:      'fixed',
        left:          pos.x + 20,
        top:           pos.y + 20,
        pointerEvents: 'none',
        zIndex:        9998,
        maxWidth:      isLong ? 400 : 200,
        background:    '#0000FF',
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
