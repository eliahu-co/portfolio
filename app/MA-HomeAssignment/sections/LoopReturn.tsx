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

export default function LoopReturn({
  color = STROKE,
  strokeWidth = 1.3,
  className = '',
}: {
  color?: string
  strokeWidth?: number
  className?: string
} = {}) {
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
      data-loop-return="true"
      data-flow-arrow="true"
      className={`pointer-events-none absolute top-0 left-full ${className}`}
      width={W}
      height={geo?.h ?? 0}
      style={{ overflow: 'visible' }}
      aria-hidden="true"
    >
      {geo && (
        <>
          <path
            data-loop-return-shaft="true"
            d={`M0,${geo.yLast} H${X} V${geo.yFirst} H0`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            data-loop-return-head="true"
            d={`M5,${geo.yFirst - 5} L0,${geo.yFirst} L5,${geo.yFirst + 5}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  )
}
