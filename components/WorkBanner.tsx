'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { gsap } from '@/lib/gsap'

// Image list + metadata are injected by WorkBannerServer.tsx.
// Edit public/architecture/metadata.json to change tooltip content.

export interface ImageMeta {
  title:       string
  year:        string
  description: string
}

interface ImageEntry {
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
  // (state changes for arrows / centeredRIdx must not recreate the array).
  const IMAGES        = rawImages
  const n             = IMAGES.length
  const IMAGES_RENDER = useMemo(() => [...IMAGES, ...IMAGES, ...IMAGES], [IMAGES])
  const stripRef    = useRef<HTMLDivElement>(null)
  const imgRefs     = useRef<(HTMLImageElement | null)[]>([])
  const canvasRefs  = useRef<(HTMLCanvasElement | null)[]>([])
  const tlRef       = useRef<gsap.core.Tween | null>(null)
  const dtRef       = useRef<gsap.core.Tween | null>(null)
  const idxRef      = useRef(n)
  const pausedRef   = useRef(false)
  const busyRef     = useRef(false)
  const durationsRef = useRef<number[]>(new Array(n).fill(DEFAULT_HOLD))

  const [hovered,      setHovered]      = useState(false)
  const [centeredRIdx, setCenteredRIdx] = useState(n)
  const [arrowLeftPx,  setArrowLeftPx]  = useState(0)
  const [arrowRightPx, setArrowRightPx] = useState(0)
  const [tooltipEntry, setTooltipEntry] = useState<ImageMeta | null>(null)
  const [tooltipPos,   setTooltipPos]   = useState({ x: 0, y: 0 })

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

  const snapArrows = (renderIdx: number) => {
    requestAnimationFrame(() => {
      const img = imgRefs.current[renderIdx]
      if (!img) return
      const rect = img.getBoundingClientRect()
      setArrowLeftPx(rect.left - 64)
      setArrowRightPx(rect.right)
    })
  }
  const getCenterX   = (i: number) => {
    const imgs = imgRefs.current as HTMLImageElement[]
    let x = 0
    for (let j = 0; j < i; j++) x += imgs[j].offsetWidth + getGap()
    return x + imgs[i].offsetWidth / 2
  }
  const getTranslate = (i: number) => getViewW() / 2 - getCenterX(i)
  const getHold      = (renderIdx: number) => durationsRef.current[renderIdx % n]

  const freezeImage = useCallback((i: number) => {
    const canvas = canvasRefs.current[i]
    const img    = imgRefs.current[i]
    if (!canvas || !img) return
    canvas.width  = img.offsetWidth
    canvas.height = img.offsetHeight
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
    busyRef.current = true

    const prev = idxRef.current
    const next = prev + delta

    freezeImage(prev)
    setCenteredRIdx(next)

    tlRef.current = gsap.to(stripRef.current, {
      x: getTranslate(next),
      duration: TRAVEL_S,
      ease: 'power2.inOut',
      onComplete: () => {
        idxRef.current = next

        if (idxRef.current >= 2 * n) {
          idxRef.current = n
          gsap.set(stripRef.current, { x: getTranslate(n) })
          setCenteredRIdx(n)
          snapArrows(n)
        } else if (idxRef.current < n) {
          idxRef.current = 2 * n - 1
          gsap.set(stripRef.current, { x: getTranslate(2 * n - 1) })
          setCenteredRIdx(2 * n - 1)
          snapArrows(2 * n - 1)
        } else {
          snapArrows(idxRef.current)
        }

        busyRef.current = false
        onDone?.()
      },
    })
  }, [freezeImage]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const strip = stripRef.current
    if (!strip) return
    const imgs = imgRefs.current.filter(Boolean) as HTMLImageElement[]

    Promise.all(
      imgs.map(img =>
        img.complete ? Promise.resolve() : new Promise<void>(res => { img.onload = () => res() })
      )
    ).then(() => {
      gsap.set(strip, { x: getTranslate(n) })
      imgs.forEach((_, i) => { if (i !== n) freezeImage(i) })
      snapArrows(n)
      scheduleNext()
    })

    return () => { tlRef.current?.kill(); dtRef.current?.kill() }
  }, [freezeImage, scheduleNext]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleMouseEnter = () => { pausedRef.current = true;  dtRef.current?.kill(); setHovered(true)  }
  const handleMouseLeave = () => { pausedRef.current = false; setHovered(false); setTooltipEntry(null); scheduleNext() }
  const handleMouseMove  = (e: React.MouseEvent) => setTooltipPos({ x: e.clientX, y: e.clientY })

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: '60vh', background: '#1a1a1a', borderTop: '2vw solid #1a1a1a', borderBottom: '2vw solid #1a1a1a' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div
        ref={stripRef}
        className="absolute top-0 h-full flex"
        style={{ gap: `${GAP_VW}vw`, willChange: 'transform' }}
      >
        {IMAGES_RENDER.map(({ src, meta }, i) => (
            <div
              key={i}
              style={{
                position: 'relative', height: '100%', width: 'auto', flexShrink: 0,
                cursor: i === centeredRIdx ? 'default' : 'pointer',
              }}
              onMouseEnter={() => setTooltipEntry(meta)}
              onMouseLeave={() => setTooltipEntry(null)}
              onClick={() => { const d = i - idxRef.current; if (d !== 0) goTo(d) }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={el => { imgRefs.current[i] = el }}
                src={src}
                alt={meta?.title ?? ''}
                style={{ height: '100%', width: 'auto', display: 'block' }}
              />
              <canvas
                ref={el => { canvasRefs.current[i] = el }}
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  opacity: i === centeredRIdx ? 0 : 1,
                  transition: 'opacity 0.1s',
                  pointerEvents: 'none',
                }}
              />
            </div>
        ))}
      </div>

      {/* Left arrow — right edge tracks the centered image's left edge */}
      <button
        aria-label="Previous image"
        onClick={() => goTo(-1)}
        className="absolute z-10 flex items-center justify-center"
        style={{
          left: arrowLeftPx + 32,
          top: '50%',
          transform: 'translateY(-50%)',
          transition: `left ${TRAVEL_S}s cubic-bezier(0.45,0,0.55,1)`,
          background: 'var(--color-canvas)', border: 'var(--border)', borderRadius: '2px', boxShadow: '0 2px 16px rgba(26,26,26,0.08)',
          width: '64px', height: '64px', cursor: 'pointer',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
          <path d="M20 6L10 16l10 10" />
        </svg>
      </button>

      {/* Rich tooltip — fixed so it escapes overflow:hidden */}
      {tooltipEntry && (
        <div
          style={{
            position:      'fixed',
            left:          tooltipPos.x + 20,
            top:           tooltipPos.y + 20,
            pointerEvents: 'none',
            zIndex:        200,
          }}
          className="bg-orange-500 px-3 py-1.5"
        >
          <p className="font-sans text-[10px] uppercase tracking-[0.12em] text-white leading-none whitespace-nowrap">
            {tooltipEntry.title}<span className="text-white/60">,&nbsp;{tooltipEntry.year}</span>
          </p>
        </div>
      )}

      {/* Right arrow — left edge tracks the centered image's right edge */}
      <button
        aria-label="Next image"
        onClick={() => goTo(1)}
        className="absolute z-10 flex items-center justify-center"
        style={{
          left: arrowRightPx - 32,
          top: '50%',
          transform: 'translateY(-50%)',
          transition: `left ${TRAVEL_S}s cubic-bezier(0.45,0,0.55,1)`,
          background: 'var(--color-canvas)', border: 'var(--border)', borderRadius: '2px', boxShadow: '0 2px 16px rgba(26,26,26,0.08)',
          width: '64px', height: '64px', cursor: 'pointer',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
          <path d="M12 6l10 10-10 10" />
        </svg>
      </button>
    </div>
  )
}
