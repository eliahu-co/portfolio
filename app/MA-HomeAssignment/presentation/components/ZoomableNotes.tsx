'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const MIN_SCALE = 1
// past roughly 4x the board is magnified beyond its own pixels and goes soft
const MAX_SCALE = 4
const WHEEL_SENSITIVITY = 0.0015

type Transform = { scale: number; x: number; y: number }
const IDENTITY: Transform = { scale: 1, x: 0, y: 0 }

/**
 * The research board is far too dense to read at the size the slide gives it,
 * so it can be zoomed with the wheel and dragged around. The wheel zooms about
 * the pointer rather than the centre, which is what makes it feel like the
 * board stays under the cursor instead of sliding away from it.
 *
 * Panning is clamped so the board can never be thrown off screen: at 1x it is
 * pinned, and beyond that it may travel exactly as far as its overflow.
 */
export function ZoomableNotes({ src, alt, active }: { src: string; alt: string; active: boolean }) {
  const frameRef = useRef<HTMLDivElement | null>(null)
  const [transform, setTransform] = useState<Transform>(IDENTITY)
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; originX: number; originY: number } | null>(null)
  const [dragging, setDragging] = useState(false)

  // the board may travel only as far as it overflows the frame, so a drag can
  // never leave empty space where the board should be
  const clamp = useCallback((next: Transform): Transform => {
    const frame = frameRef.current
    if (!frame) return next
    const { width, height } = frame.getBoundingClientRect()
    const overflowX = Math.max(0, width * next.scale - width) / 2
    const overflowY = Math.max(0, height * next.scale - height) / 2
    return {
      scale: next.scale,
      x: Math.min(overflowX, Math.max(-overflowX, next.x)),
      y: Math.min(overflowY, Math.max(-overflowY, next.y)),
    }
  }, [])

  const reset = useCallback(() => setTransform(IDENTITY), [])

  // leaving the Play step puts the board back as it was found
  useEffect(() => {
    if (!active) reset()
  }, [active, reset])

  // wheel has to be bound natively: React's listener is passive, so it cannot
  // preventDefault and the page would scroll while zooming
  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const rect = frame.getBoundingClientRect()
      // pointer position relative to the frame's centre, which is where the
      // scale transform is anchored
      const pointerX = event.clientX - rect.left - rect.width / 2
      const pointerY = event.clientY - rect.top - rect.height / 2

      setTransform((current) => {
        const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, current.scale * Math.exp(-event.deltaY * WHEEL_SENSITIVITY)))
        const ratio = scale / current.scale
        return clamp({
          scale,
          // hold whatever sits under the pointer in place while the scale changes
          x: pointerX - (pointerX - current.x) * ratio,
          y: pointerY - (pointerY - current.y) * ratio,
        })
      })
    }

    frame.addEventListener('wheel', onWheel, { passive: false })
    return () => frame.removeEventListener('wheel', onWheel)
  }, [clamp])

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: transform.x,
      originY: transform.y,
    }
    setDragging(true)
    // capture keeps a fast drag tracking once the cursor leaves the frame; it is
    // an enhancement, so a environment without it still pans
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    setTransform((current) => clamp({
      scale: current.scale,
      x: drag.originX + (event.clientX - drag.startX),
      y: drag.originY + (event.clientY - drag.startY),
    }))
  }

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return
    dragRef.current = null
    setDragging(false)
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture?.(event.pointerId)
    }
  }

  const zoomed = transform.scale > MIN_SCALE

  return (
    <div
      ref={frameRef}
      data-notes-viewer="true"
      data-deck-interactive="true"
      data-notes-zoomed={zoomed ? 'true' : 'false'}
      data-notes-dragging={dragging ? 'true' : 'false'}
      data-notes-scale={transform.scale.toFixed(2)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onDoubleClick={reset}
      // the cursor is set in PresentationStage.module.css, which has to override
      // the deck's blanket `cursor: pointer !important` for interactive elements
      className="relative h-full w-full touch-none overflow-hidden"
    >
      <div
        data-notes-canvas="true"
        style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})` }}
        className={`relative h-full w-full ${dragging ? '' : 'transition-transform duration-150 motion-reduce:transition-none'}`}
      >
        {/*
          A plain img, deliberately, on both counts:

          next/image sizes its candidate from the space the board occupies
          unzoomed — about 1120px — so zooming magnified a 1120px thumbnail and
          the notes turned to mush. Zoom needs the whole file, and the file in
          public is already a tuned WebP, so the optimizer has nothing to add.

          It also loads eagerly. Lazy loading resolves against a box that is
          hidden until the Play step is hovered and then transformed, and it
          fired unreliably there — leaving the step blank. This image is the
          entire point of the step, so it is fetched with the slide.
        */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="eager"
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-contain object-center"
        />
      </div>
    </div>
  )
}
