// components/WhatIDo.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { showTooltip, hideTooltip } from '@/components/Tooltip'

const CARDS = [
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
  const [activeCard, setActiveCard] = useState<string | null>('Design')

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
      className="relative px-8 pt-4 pb-16 md:px-16 lg:px-24"
      style={{ zIndex: 1, background: '#F3DBC1' }}
    >
      <div className="max-w-6xl mx-auto">
        <div
          ref={cardsRef}
          className="grid md:grid-cols-4 border-2 border-ink"
        >
          {CARDS.map((card, i) => (
            <article
              key={card.title}
              className={`whatiodo-card group relative px-5 py-3 border-ink cursor-pointer transition-colors duration-200
                ${i < CARDS.length - 1 ? 'border-b-2 md:border-b-0 md:border-r-2' : ''}`}
              style={activeCard === card.title ? { background: '#D6BF78' } : {}}
              onClick={() => handleClick(card.title)}
              onMouseEnter={e => {
                if (activeCard !== card.title) e.currentTarget.style.background = '#D6BF78'
                showTooltip('Click')
              }}
              onMouseLeave={e => {
                if (activeCard !== card.title) e.currentTarget.style.background = ''
                hideTooltip()
              }}
            >
              {/* Category tag */}
              <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-ink/40 mb-3 transition-colors duration-200 group-hover:text-ink/60">
                {card.category}
              </p>

              {/* Title */}
              <h3 className="font-serif text-[20px] text-ink transition-colors duration-200 group-hover:text-ink">
                {card.title}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
