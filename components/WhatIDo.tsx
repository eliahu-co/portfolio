// components/WhatIDo.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { showTooltip, hideTooltip } from '@/components/Tooltip'
import { ORANGE, ORANGE_HOVER } from '@/lib/tokens'

const CARDS: { category: string; title: string; mobileTitle?: string; description: string }[] = [
  {
    category: 'Strategy · Full-Stack',
    title: 'Product & Dev',
    description: 'From embedded React/Node.js work shipping production code at Veev to POC development in Python and FastAPI — I write code that goes to production, not just demos.',
  },
  {
    category: 'Construction · BIM',
    title: 'Architecture',
    description: "A decade of practice across Brazil, the Netherlands, and Israel — from construction documents and BIM models to competition submissions with SOM and ARUP.",
  },
  {
    category: 'Innovation · Problem-Solving',
    title: 'Research & Development',
    mobileTitle: 'Research & Dev',
    description: "Five years owning full product lifecycles: PRDs, technology evaluation, cross-functional leadership across BIM, Data, Automation, and Manufacturing.",
  },
  {
    category: 'Product · Furniture',
    title: 'Design',
    description: '',
  },
]

export default function WhatIDo() {
  const sectionRef   = useRef<HTMLElement>(null)
  const cardsRef     = useRef<HTMLDivElement>(null)
  const [activeCard,  setActiveCard]  = useState<string | null>('Design')
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const handleClick = (title: string) => {
    setActiveCard(prev => prev === title ? null : title)
    window.dispatchEvent(new CustomEvent('card-select', { detail: title }))
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.whatiodo-card', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 75%',
          once: true,
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="what-i-do"
      ref={sectionRef}
      className="relative"
      style={{ zIndex: 1, borderBottom: '8px solid #ffffff' }}
    >
      <div>
        <div
          ref={cardsRef}
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ border: '2px solid var(--color-orange)' }}
        >
          {CARDS.map((card, i) => {
            const isActive  = activeCard === card.title
            const isHovered = hoveredCard === card.title
            const lit       = isActive || isHovered
            const bg        = isActive ? ORANGE : isHovered ? ORANGE_HOVER : 'transparent'
            return (
              <article
                key={card.title}
                className={`whatiodo-card relative py-2 md:py-3 cursor-pointer px-3 ${i === 0 ? 'md:pl-16 lg:pl-24 md:pr-5' : 'md:pl-8 md:pr-5'}`}
                style={{
                  background: bg,
                  transition: 'background 0.15s',
                }}
                onClick={() => handleClick(card.title)}
                onMouseEnter={() => { setHoveredCard(card.title); showTooltip('Click') }}
                onMouseLeave={() => { setHoveredCard(null); hideTooltip() }}
              >
                <p
                  className="font-sans text-[10px] uppercase tracking-[0.1em] mb-3"
                  style={{ color: lit ? 'rgba(255,255,255,0.6)' : `${ORANGE}99`, transition: 'color 0.15s' }}
                >
                  {card.category}
                </p>
                <h3
                  className="font-serif text-[20px]"
                  style={{ color: lit ? '#ffffff' : ORANGE, transition: 'color 0.15s' }}
                >
                  {card.mobileTitle
                    ? <><span className="md:hidden">{card.mobileTitle}</span><span className="hidden md:inline">{card.title}</span></>
                    : card.title}
                </h3>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
