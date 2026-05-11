// components/About.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import { showTooltip, hideTooltip } from '@/components/Tooltip'

const SKILL_TAGS = ['Product', 'BIM', 'ConTech', 'React · Node.js', 'Digital Twin', 'CAD-to-CAM']

const LAYERS = [
  { id: 'center',        src: '/profile_pic.jpeg' },
  { id: 'up',            src: '/profile_pic/up.jpeg' },
  { id: 'down',          src: '/profile_pic/down.jpeg' },
  { id: 'right',         src: '/profile_pic/right.jpeg' },
  { id: 'diagonal_up',   src: '/profile_pic/diagonal_up.jpeg' },
  { id: 'diagonal_down', src: '/profile_pic/diagonal_down.jpeg' },
] as const

type LayerId = typeof LAYERS[number]['id']

function getGaze(cursorX: number, cursorY: number, rect: DOMRect): LayerId {
  const dx = cursorX - (rect.left + rect.width / 2)
  const dy = cursorY - (rect.top  + rect.height / 2)

  if (Math.hypot(dx, dy) < rect.width * 0.2) return 'center'

  const a = Math.atan2(dy, dx) * (180 / Math.PI)

  if (a >= -112.5 && a < -67.5) return 'up'
  if (a >= -67.5  && a < -22.5) return 'diagonal_up'
  if (a >= -22.5  && a <  22.5) return 'right'
  if (a >= 22.5   && a <  67.5) return 'diagonal_down'
  if (a >= 67.5   && a < 112.5) return 'down'

  return 'center'
}

const FADE_MS = 180

export default function About() {
  const leftRef  = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)

  // Two-slot crossfade: prev stays fully opaque underneath while active fades in on top.
  // This prevents both images from being semi-transparent simultaneously (the flicker cause).
  const [active, setActive] = useState<LayerId>('center')
  const [prev,   setPrev]   = useState<LayerId | null>(null)
  const activeRef   = useRef<LayerId>('center')
  const clearTimer  = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(leftRef.current, {
        y: 40, opacity: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: leftRef.current, start: 'top 80%', once: true },
      })
      gsap.from(rightRef.current, {
        y: 40, opacity: 0, duration: 0.8, delay: 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: rightRef.current, start: 'top 80%', once: true },
      })
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const rect = photoRef.current?.getBoundingClientRect()
      if (!rect) return
      const next = getGaze(e.clientX, e.clientY, rect)
      if (next === activeRef.current) return

      if (clearTimer.current) clearTimeout(clearTimer.current)
      setPrev(activeRef.current)
      activeRef.current = next
      setActive(next)
      // Clear prev after fade completes so it doesn't linger in the DOM stack
      clearTimer.current = setTimeout(() => setPrev(null), FADE_MS)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (clearTimer.current) clearTimeout(clearTimer.current)
    }
  }, [])

  return (
    <section id="about" className="relative px-8 pt-16 pb-4 md:px-16 lg:px-24" style={{ zIndex: 1, background: '#F3DBC1' }}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-1 items-start">

        {/* Left column */}
        <div ref={leftRef} className="relative w-full aspect-square max-w-sm">
          <div
            ref={photoRef}
            className="absolute inset-0"
            role="img"
            aria-label="Eliahu Cohen"
            onMouseEnter={() => showTooltip('Me')}
            onMouseLeave={hideTooltip}
          >
            {LAYERS.map(({ id, src }) => {
              const isActive = id === active
              const isPrev   = id === prev
              if (!isActive && !isPrev) return null

              return (
                <div
                  key={id}
                  className="absolute inset-0"
                  style={{
                    zIndex:    isActive ? 2 : 1,
                    opacity:   isPrev   ? 1 : undefined,
                    animation: isActive && prev !== null
                      ? `photo-fade-in ${FADE_MS}ms ease forwards`
                      : 'none',
                  }}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover object-top rounded-sm"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={id === 'center'}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Right column */}
        <div ref={rightRef} className="pt-4">
          <p className="font-sans text-[17px] leading-relaxed font-medium text-ink/80 mb-10">
            After a decade spanning architectural practice across Brazil, the Netherlands, and Israel,
            I spent the last five years at Veev as a Senior R&amp;D Product Architect — owning the
            full product lifecycle from PRDs and technology research to hands-on BIM, data, and
            manufacturing pipelines. In my last year I embedded part-time in the engineering team,
            shipping production code alongside the core dev squad.
          </p>

          <div className="flex flex-wrap gap-2">
            {SKILL_TAGS.map((tag) => (
              <span
                key={tag}
                className="font-sans text-[11px] uppercase tracking-[0.08em] border border-ink/20 text-ink/60 px-3 py-1 rounded-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
