// components/About.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import { showTooltip, hideTooltip } from '@/components/Tooltip'

const SKILL_TAGS = ['Architecture', 'Product', 'Full Stack', 'BIM', 'ConTech', 'Digital Twin', 'CAD-to-CAM']

const DEFAULT_BIO = `After a decade spanning architectural practice across Brazil, the Netherlands, and Israel, I spent the last five years at Veev as a Senior R&D Product Architect — owning the full product lifecycle from PRDs and technology research to hands-on BIM, data, and manufacturing pipelines. In my last year I embedded part-time in the engineering team, shipping production code alongside the core dev squad.`

const TAG_BIO: Record<string, string> = {
  'Architecture':  DEFAULT_BIO,
  'Product':       `Five years owning full product lifecycles at Veev — from writing PRDs and evaluating technology to leading cross-functional teams across Software, Data, Automation, and BIM. Responsible for documenting and driving NPI processes end-to-end. Having sat on both sides of the PRD process — as the R&D author and as an engineer implementing specs — I write requirements that engineering can actually act on.`,
  'BIM':           `A decade of BIM practice across three countries — from construction documents and coordination models to complex combo family creation, custom scripts, add-ons, and MCP development. At Veev, I was part of the team building the digital backbone of a factory-built housing system, including full review and delivery processes through ACC.`,
  'ConTech':       `Five years at the intersection of construction and technology — deploying both software and hardware products across BIM, manufacturing, and site operations. From IFC automation to digital twin dashboards and physical tooling, I've built ConTech products that made it to the field.`,
  'Full Stack':    `Trained at ITC and battle-tested at Veev — where I spent my last year embedded in the core engineering team, shipping production React and Node.js code alongside full-time devs. I work across the stack in Python, FastAPI, and TypeScript: internal tooling, BIM automation pipelines, and client-facing applications. This portfolio is one of them.`,
  'Digital Twin':  `Led the development of Veev's digital twin infrastructure — connecting BIM geometry to live factory and site data. Built the pipelines that turned construction models into operational dashboards used by field and manufacturing teams.`,
  'CAD-to-CAM':    `Owned the CAD-to-CAM pipeline at Veev, translating architectural models into machine-ready manufacturing instructions. Worked across Revit, custom Python automation, and CNC tooling to close the loop between design and fabrication.`,
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&'

function useScramble(initial: string) {
  const [text, setText] = useState(initial)
  const rafRef = useRef<number>(0)

  const scrambleTo = (next: string) => {
    cancelAnimationFrame(rafRef.current)
    const len = next.length
    let frame = 0
    const totalFrames = 20

    const tick = () => {
      frame++
      const resolved = Math.floor((frame / totalFrames) * len)
      const scrambled = Array.from({ length: len }, (_, i) => {
        if (i < resolved) return next[i]
        if (next[i] === ' ' || next[i] === '\n') return next[i]
        return CHARS[Math.floor(Math.random() * CHARS.length)]
      }).join('')
      setText(scrambled)
      if (frame < totalFrames) rafRef.current = requestAnimationFrame(tick)
      else setText(next)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  return { text, scrambleTo }
}

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

  const { text: bioText, scrambleTo } = useScramble(DEFAULT_BIO)
  const [activeTag,  setActiveTag]  = useState('Architecture')
  const [pinnedTag,  setPinnedTag]  = useState('Architecture')

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
      clearTimer.current = setTimeout(() => setPrev(null), FADE_MS)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (clearTimer.current) clearTimeout(clearTimer.current)
    }
  }, [])

  return (
    <section id="about" className="relative px-8 py-16 md:px-16 lg:px-24" style={{ zIndex: 1, background: '#f5f5f5' }}>
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
        <div ref={rightRef} className="pt-4 flex flex-col gap-8">
          <div className="flex flex-wrap gap-1.5">
            {SKILL_TAGS.map((tag) => (
              <span
                key={tag}
                className="font-sans text-[10px] uppercase tracking-[0.06em] px-2 py-0.5 rounded-sm cursor-default transition-all duration-150"
                style={activeTag === tag
                  ? { background: '#ff6b35', border: '2px solid #ff6b35', color: '#fff' }
                  : { border: '2px solid rgba(255,107,53,0.5)', color: '#ff6b35' }}
                onMouseEnter={() => { showTooltip('Click'); if (tag === pinnedTag) return; setActiveTag(tag); scrambleTo(TAG_BIO[tag] ?? DEFAULT_BIO) }}
                onMouseLeave={() => { hideTooltip(); if (tag === pinnedTag) return; setActiveTag(pinnedTag); scrambleTo(TAG_BIO[pinnedTag] ?? DEFAULT_BIO) }}
                onClick={() => { setPinnedTag(tag); setActiveTag(tag) }}
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="font-sans text-[17px] leading-relaxed font-medium text-ink/80">
            {bioText}
          </p>
        </div>

      </div>
    </section>
  )
}
