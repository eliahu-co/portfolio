'use client'

// app/MA-HomeAssignment/sections/LoopReturn.tsx
// Loop-back connector for a cyclical workflow lane: an arrow that leaves the
// right side of the last step, runs up the right gutter, and points back into
// the first step — closing the loop. Positions are measured from the rendered
// step boxes (data-loop-step) so it stays aligned as steps wrap or the layout
// resizes. Rendered as an absolute overlay inside a `relative` Lane.

import { useLayoutEffect, useRef, useState } from 'react'

const STROKE = 'rgba(30,123,168,0.55)' // matches the current-lane connectors
const W = 18                            // how far the loop bows into the right gutter
const X = W - 6                         // x of the vertical run

export default function LoopReturn() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [geo, setGeo] = useState<{ h: number; yFirst: number; yLast: number } | null>(null)

  useLayoutEffect(() => {
    const wrap = svgRef.current?.parentElement
    if (!wrap) return
    const measure = () => {
      const steps = wrap.querySelectorAll<HTMLElement>('[data-loop-step]')
      if (steps.length < 2) return
      const wr = wrap.getBoundingClientRect()
      const first = steps[0].getBoundingClientRect()
      const last = steps[steps.length - 1].getBoundingClientRect()
      setGeo({
        h: wr.height,
        yFirst: first.top - wr.top + first.height / 2,
        yLast: last.top - wr.top + last.height / 2,
      })
    }
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [])

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none absolute top-0 left-full"
      width={W}
      height={geo?.h ?? 0}
      style={{ overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        <marker id="loop-return-arrow" viewBox="0 0 12 12" refX="8" refY="6" markerWidth="9" markerHeight="9" orient="auto">
          <path d="M3.5,2.5 L8,6 L3.5,9.5" fill="none" stroke={STROKE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>
      {geo && (
        <path
          d={`M0,${geo.yLast} H${X} V${geo.yFirst} H0`}
          fill="none"
          stroke={STROKE}
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          markerEnd="url(#loop-return-arrow)"
        />
      )}
    </svg>
  )
}
