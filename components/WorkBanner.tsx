'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { gsap } from '@/lib/gsap'
import { showTooltip, hideTooltip } from '@/components/Tooltip'

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

interface Props { images: ImageEntry[] }


const GAP_VW       = 2
const DEFAULT_HOLD = 3      // seconds for non-GIFs or parse failures
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

export default function WorkBanner({ images: rawImages }: Props) {
  // rawImages is already shuffled by the server — use it directly.
  // IMAGES_RENDER is memoised so its reference stays stable across re-renders
  // (state changes for centeredRIdx must not recreate the array).
  const IMAGES        = rawImages
  const n             = IMAGES.length
  const IMAGES_RENDER = useMemo(() => [...IMAGES, ...IMAGES, ...IMAGES], [IMAGES])
  const stripRef      = useRef<HTMLDivElement>(null)
  const arrowCursorRef = useRef<HTMLDivElement>(null)
  const imgRefs       = useRef<(HTMLImageElement | null)[]>([])
  const canvasRefs    = useRef<(HTMLCanvasElement | null)[]>([])
  const tlRef         = useRef<gsap.core.Tween | null>(null)
  const dtRef         = useRef<gsap.core.Tween | null>(null)
  const idxRef        = useRef(n)
  const pausedRef     = useRef(false)
  const busyRef       = useRef(false)
  const touchStartX = useRef(0)
  const durationsRef  = useRef<number[]>(new Array(n).fill(DEFAULT_HOLD))

  const [centeredRIdx, setCenteredRIdx] = useState(n)
  const [stripReady,   setStripReady]   = useState(false)
  const arrowHideTimerRef = useRef<number | null>(null)

  // Pre-fetch GIF durations
  useEffect(() => {
    IMAGES.forEach(async ({ src }, i) => {
      if (/\.gif$/i.test(src)) {
        durationsRef.current[i] = await getGifDuration(src)
      }
    })
  }, [])

  const getViewW     = () => document.documentElement.clientWidth
  const getGap       = () => getViewW() * (GAP_VW / 100)

  const getCenterX = (i: number) => {
    const imgs = imgRefs.current
    let x = 0
    for (let j = 0; j < i; j++) {
      const img = imgs[j]
      if (!img) return null
      x += img.offsetWidth + getGap()
    }
    const img = imgs[i]
    if (!img) return null
    return x + img.offsetWidth / 2
  }
  const getTranslate = (i: number) => {
    const cx = getCenterX(i)
    return cx === null ? null : getViewW() / 2 - cx
  }
  const getHold      = (renderIdx: number) => durationsRef.current[renderIdx % n]

  const freezeImage = useCallback((i: number) => {
    const canvas = canvasRefs.current[i]
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
    const imgs = imgRefs.current.filter(Boolean) as HTMLImageElement[]

    Promise.all(
      imgs.map(img =>
        img.complete ? Promise.resolve() : new Promise<void>(res => { img.onload = () => res() })
      )
    ).then(() => {
      if (!alive) return
      const t = getTranslate(n); if (t !== null) gsap.set(strip, { x: t })
      setStripReady(true)
      imgs.forEach((_, i) => { if (i !== n) freezeImage(i) })
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
    if (n === 0) return
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
    if (n === 0) return
    window.dispatchEvent(new CustomEvent('cursor:show'))
    if (arrowCursorRef.current) {
      delete arrowCursorRef.current.dataset.active
      arrowCursorRef.current.style.opacity = '0'
    }
  }

  const handleBannerClick = () => {
    const dir = arrowCursorRef.current?.dataset.dir
    goTo(dir === 'left' ? -1 : 1)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) < 50) return

    const arrow = arrowCursorRef.current
    if (arrow) {
      const path = arrow.querySelector('path')
      // delta < 0 = swiped left = moving to next (rightward in strip)
      if (path) path.setAttribute('d', delta < 0 ? 'M12 6l10 10-10 10' : 'M20 6L10 16l10 10')
      arrow.style.transform = `translate(${window.innerWidth / 2 - 32}px, ${window.innerHeight / 2 - 32}px)`
      arrow.style.opacity = '1'
      if (arrowHideTimerRef.current !== null) clearTimeout(arrowHideTimerRef.current)
      arrowHideTimerRef.current = window.setTimeout(() => {
        if (arrowCursorRef.current) arrowCursorRef.current.style.opacity = '0'
      }, 2000)
    }

    goTo(delta < 0 ? 1 : -1)
  }

  return (
    <div
      className="relative w-full overflow-hidden h-[60vh] md:h-[80vh]"
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

      <div
        ref={stripRef}
        className="absolute top-0 h-full flex"
        style={{ gap: `${GAP_VW}vw`, willChange: 'transform', opacity: stripReady ? 1 : 0, transition: 'opacity 0.3s' }}
      >
        {IMAGES_RENDER.map(({ src, meta }, i) => (
            <div
              key={i}
              className="wb-slot"
              style={{ position: 'relative', height: '100%', width: 'auto', flexShrink: 0 }}
              onMouseEnter={() => showTooltip(meta ? `${meta.title}, ${meta.year}` : 'tooltip to be added', 'below-center')}
              onMouseLeave={hideTooltip}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={el => { imgRefs.current[i] = el }}
                src={src}
                alt={meta?.title ?? ''}
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
        ))}
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
