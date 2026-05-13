'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { gsap } from '@/lib/gsap'
import { showTooltip, hideTooltip } from '@/components/Tooltip'
import { MOBILE_BREAKPOINT } from '@/lib/tokens'

const isMobile = () => typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT

// Image list + metadata are injected by WorkBannerServer.tsx.
// Edit public/architecture/metadata.json to change tooltip content.

export interface ImageMeta {
  title:       string
  year:        string
  description: string
}

export interface ImageEntry {
  src:  string
  meta: ImageMeta | null
}

// A slot holds 1 image, or 2 landscape images stacked vertically.
// aspectRatio = slot width/height ratio computed from both images so each fills full slot width.
export interface ImageSlot {
  a: ImageEntry
  b: ImageEntry | null  // non-null = landscape pair
  aspectRatio?: number  // paired only: 1 / (1/aspect_a + 1/aspect_b)
}

interface Props { slots: ImageSlot[] }

const GAP_VW       = 2
const DEFAULT_HOLD = 3          // seconds for non-GIFs or parse failures
const TRAVEL_S     = 0.7

// Parse a GIF's total animation duration by summing frame delays in the binary.
// GIF frame delays live in Graphic Control Extension blocks (0x21 0xF9),
// stored as a little-endian uint16 in centiseconds.
async function getGifDuration(src: string): Promise<number> {
  try {
    const buf  = await fetch(src).then(r => r.arrayBuffer())
    const data = new Uint8Array(buf)
    let totalCs = 0
    // Logical screen descriptor: 7 bytes starting at offset 6
    const hasGCT      = (data[10] & 0x80) !== 0
    const gctSize     = hasGCT ? 3 * (2 ** ((data[10] & 0x07) + 1)) : 0
    let i = 13 + gctSize

    while (i < data.length) {
      if (data[i] === 0x3B) break                   // trailer
      if (data[i] === 0x21 && data[i + 1] === 0xF9) {
        // Graphic Control Extension — delay at bytes i+4..i+5
        totalCs += data[i + 4] | (data[i + 5] << 8)
        i += 8
      } else if (data[i] === 0x21) {
        // Other extension — skip sub-blocks
        i += 2
        while (i < data.length && data[i] !== 0) i += data[i] + 1
        i++
      } else if (data[i] === 0x2C) {
        // Image descriptor — skip local colour table + LZW data
        const hasLCT  = (data[i + 9] & 0x80) !== 0
        const lctSize = hasLCT ? 3 * (2 ** ((data[i + 9] & 0x07) + 1)) : 0
        i += 10 + lctSize + 1   // +1 for LZW min code size
        while (i < data.length && data[i] !== 0) i += data[i] + 1
        i++
      } else {
        i++
      }
    }
    return totalCs > 0 ? totalCs / 100 : DEFAULT_HOLD
  } catch {
    return DEFAULT_HOLD
  }
}

export default function WorkBanner({ slots }: Props) {
  const n             = slots.length
  const SLOTS_RENDER  = useMemo(() => [...slots, ...slots, ...slots], [slots])
  const stripRef      = useRef<HTMLDivElement>(null)
  const arrowCursorRef = useRef<HTMLDivElement>(null)
  const slotRefs      = useRef<(HTMLDivElement | null)[]>([])
  const imgRefs       = useRef<(HTMLImageElement | null)[]>([])
  const canvasRefs    = useRef<(HTMLCanvasElement | null)[]>([])
  const tlRef         = useRef<gsap.core.Tween | null>(null)
  const dtRef         = useRef<gsap.core.Tween | null>(null)
  const idxRef        = useRef(n)
  const pausedRef     = useRef(false)
  const busyRef       = useRef(false)
  const touchStartX   = useRef(0)
  const durationsRef  = useRef<number[]>(new Array(n).fill(DEFAULT_HOLD))

  const [centeredRIdx, setCenteredRIdx] = useState(n)
  const [stripReady,   setStripReady]   = useState(false)
  const arrowHideTimerRef = useRef<number | null>(null)

  // Pre-fetch GIF durations
  useEffect(() => {
    slots.forEach(({ a }, i) => {
      if (/\.gif$/i.test(a.src)) {
        getGifDuration(a.src).then(d => { durationsRef.current[i] = d })
      }
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const getViewW  = () => document.documentElement.clientWidth
  const getGap    = () => getViewW() * (GAP_VW / 100)

  const getCenterX = (i: number) => {
    let x = 0
    for (let j = 0; j < i; j++) {
      const el = slotRefs.current[j]
      if (!el) return null
      x += el.offsetWidth + getGap()
    }
    const el = slotRefs.current[i]
    if (!el) return null
    return x + el.offsetWidth / 2
  }
  const getTranslate = (i: number) => {
    const cx = getCenterX(i)
    return cx === null ? null : getViewW() / 2 - cx
  }
  const getHold = (renderIdx: number) => durationsRef.current[renderIdx % n]

  const freezeImage = useCallback((i: number) => {
    const canvas = canvasRefs.current[i]  // null for paired slots → early return
    const img    = imgRefs.current[i]
    if (!canvas || !img) return
    canvas.width        = img.offsetWidth
    canvas.height       = img.offsetHeight
    canvas.style.width  = `${img.offsetWidth}px`
    canvas.style.height = `${img.offsetHeight}px`
    canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height)
  }, [])

  const scheduleNext = useCallback(() => {
    dtRef.current?.kill()
    if (pausedRef.current) return
    const hold = getHold(idxRef.current)
    dtRef.current = gsap.delayedCall(hold, () => goTo(1, scheduleNext)) // eslint-disable-line @typescript-eslint/no-use-before-define
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const goTo = useCallback((delta: number, onDone?: () => void) => {
    if (busyRef.current) return
    const tx = getTranslate(idxRef.current + delta)
    if (tx === null || !stripRef.current) return
    busyRef.current = true

    const prev = idxRef.current
    const next = prev + delta

    freezeImage(prev)
    setCenteredRIdx(next)

    tlRef.current = gsap.to(stripRef.current, {
      x: tx,
      duration: TRAVEL_S,
      ease: 'power2.inOut',
      onComplete: () => {
        idxRef.current = next

        if (idxRef.current >= 2 * n) {
          idxRef.current = n
          const t = getTranslate(n); if (t !== null) gsap.set(stripRef.current, { x: t })
          setCenteredRIdx(n)
        } else if (idxRef.current < n) {
          idxRef.current = 2 * n - 1
          const t = getTranslate(2 * n - 1); if (t !== null) gsap.set(stripRef.current, { x: t })
          setCenteredRIdx(2 * n - 1)
        }

        busyRef.current = false
        onDone?.()
      },
    })
  }, [freezeImage]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let alive = true
    const strip = stripRef.current
    if (!strip) return

    // Collect every <img> in the strip (covers both single and paired slots)
    const imgs = Array.from(strip.querySelectorAll('img')) as HTMLImageElement[]

    Promise.all(
      imgs.map(img =>
        img.complete ? Promise.resolve() : new Promise<void>(res => { img.onload = () => res() })
      )
    ).then(() => {
      if (!alive) return
      const t = getTranslate(n); if (t !== null) gsap.set(strip, { x: t })
      setStripReady(true)
      for (let i = 0; i < SLOTS_RENDER.length; i++) { if (i !== n) freezeImage(i) }
      scheduleNext()
    })

    const onResize = () => {
      if (!alive) return
      const t = getTranslate(idxRef.current); if (t !== null) gsap.set(strip, { x: t })
    }
    window.addEventListener('resize', onResize)
    return () => {
      alive = false
      tlRef.current?.kill()
      dtRef.current?.kill()
      if (arrowHideTimerRef.current !== null) clearTimeout(arrowHideTimerRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [freezeImage, scheduleNext]) // eslint-disable-line react-hooks/exhaustive-deps

  // Arrow cursor — tracks mouse, updates direction and position imperatively
  useEffect(() => {
    const el = arrowCursorRef.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      if (!el.dataset.active) return
      el.style.transform = `translate(${e.clientX - 32}px, ${e.clientY - 32}px)`
      const img = imgRefs.current[idxRef.current]
      if (!img) return
      const rect = img.getBoundingClientRect()
      const isLeft = e.clientX < rect.left + rect.width / 2
      const path = el.querySelector('path')
      if (path) path.setAttribute('d', isLeft ? 'M20 6L10 16l10 10' : 'M12 6l10 10-10 10')
      el.dataset.dir = isLeft ? 'left' : 'right'
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const handleMouseEnter = () => {
    pausedRef.current = true
    dtRef.current?.kill()
    if (n === 0 || isMobile()) return
    window.dispatchEvent(new CustomEvent('cursor:hide'))
    if (arrowCursorRef.current) {
      arrowCursorRef.current.dataset.active = '1'
      arrowCursorRef.current.style.opacity = '1'
    }
  }

  const handleMouseLeave = () => {
    pausedRef.current = false
    hideTooltip()
    scheduleNext()
    if (n === 0 || isMobile()) return
    window.dispatchEvent(new CustomEvent('cursor:show'))
    if (arrowCursorRef.current) {
      delete arrowCursorRef.current.dataset.active
      arrowCursorRef.current.style.opacity = '0'
    }
  }

  const handleBannerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile()) {
      const rect = e.currentTarget.getBoundingClientRect()
      const isLeft = e.clientX < rect.left + rect.width / 2
      const arrow = arrowCursorRef.current
      if (arrow) {
        const path = arrow.querySelector('path')
        if (path) path.setAttribute('d', isLeft ? 'M20 6L10 16l10 10' : 'M12 6l10 10-10 10')
        arrow.style.transform = `translate(${e.clientX - 32}px, ${e.clientY - 32}px)`
        arrow.style.opacity = '1'
        if (arrowHideTimerRef.current !== null) clearTimeout(arrowHideTimerRef.current)
        arrowHideTimerRef.current = window.setTimeout(() => {
          if (arrowCursorRef.current) arrowCursorRef.current.style.opacity = '0'
        }, 1500)
      }
      goTo(isLeft ? -1 : 1)
      return
    }
    const dir = arrowCursorRef.current?.dataset.dir
    goTo(dir === 'left' ? -1 : 1)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) < 50) return
    goTo(delta < 0 ? 1 : -1)
  }

  return (
    <div
      className="relative w-full overflow-hidden h-[72vh] md:h-[80vh]"
      style={{ background: 'var(--color-orange)', borderTop: '2vw solid var(--color-orange)', borderBottom: '2vw solid var(--color-orange)', cursor: n === 0 ? 'default' : 'none' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleBannerClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {n === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none">
          <div>
            <p className="font-sans text-[13px] uppercase tracking-[0.12em]" style={{ color: '#F3DBC1' }}>
              Under Construction.
            </p>
            <p className="font-sans text-[13px] uppercase tracking-[0.12em] mt-2" style={{ color: '#F3DBC1', opacity: 0.65 }}>
              To be added: FAST-ener, IFC QCer, Therm and Studio apps.
            </p>
          </div>
        </div>
      )}

      {!stripReady && (
        <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center gap-[2vw] px-[4vw] pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`wb-skeleton-slot${i > 0 ? ' hidden md:block' : ''}`} />
          ))}
        </div>
      )}

      <div
        ref={stripRef}
        className="absolute top-0 h-full flex"
        style={{ gap: `${GAP_VW}vw`, willChange: 'transform', opacity: stripReady ? 1 : 0, transition: 'opacity 0.3s' }}
      >
        {SLOTS_RENDER.map((slot, i) => {
          const tooltipLabel = slot.a.meta ? `${slot.a.meta.title}, ${slot.a.meta.year}` : 'tooltip to be added'

          if (slot.b) {
            // ── Paired landscape slot ────────────────────────────────────────
            // aspect-ratio sets width = height × ratio so both images fill full slot width.
            // overflow: hidden clips the tiny bottom sliver caused by the inter-image gap.
            return (
              <div
                key={i}
                ref={el => { slotRefs.current[i] = el }}
                style={{
                  position:      'relative',
                  height:        '100%',
                  flexShrink:    0,
                  display:       'flex',
                  flexDirection: 'column',
                  gap:           `${GAP_VW}vw`,
                  overflow:      'hidden',
                  ...(slot.aspectRatio ? { aspectRatio: String(slot.aspectRatio) } : {}),
                }}
                onMouseEnter={() => showTooltip(tooltipLabel, 'below-center')}
                onMouseLeave={hideTooltip}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={el => { imgRefs.current[i] = el }}
                  src={slot.a.src}
                  alt={slot.a.meta?.title ?? ''}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slot.b.src}
                  alt={slot.b.meta?.title ?? ''}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            )
          }

          // ── Single image slot ────────────────────────────────────────────
          return (
            <div
              key={i}
              ref={el => { slotRefs.current[i] = el }}
              className="wb-slot"
              style={{ position: 'relative', height: '100%', width: 'auto', flexShrink: 0 }}
              onMouseEnter={() => showTooltip(tooltipLabel, 'below-center')}
              onMouseLeave={hideTooltip}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={el => { imgRefs.current[i] = el }}
                src={slot.a.src}
                alt={slot.a.meta?.title ?? ''}
                className="wb-img"
              />
              <canvas
                ref={el => { canvasRefs.current[i] = el }}
                style={{
                  position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
                  opacity: i === centeredRIdx ? 0 : 1,
                  transition: 'opacity 0.1s',
                  pointerEvents: 'none',
                }}
              />
            </div>
          )
        })}
      </div>

      {/* Directional arrow cursor — follows mouse, direction set imperatively */}
      <div
        ref={arrowCursorRef}
        className="fixed top-0 left-0 z-[10000] pointer-events-none"
        style={{
          width: '64px',
          height: '64px',
          background: 'var(--color-gray-ui)',
          border: '3px solid #0000FF',
          borderRadius: '2px',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          willChange: 'transform',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#0000FF" strokeWidth="3.5" strokeLinecap="square" aria-hidden="true">
          <path d="M20 6L10 16l10 10" />
        </svg>
      </div>
    </div>
  )
}
