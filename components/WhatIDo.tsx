// components/WhatIDo.tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

const CARDS = [
  {
    category: 'Coding · Full-Stack',
    title: 'Development',
    description:
      'From embedded React/Node.js work shipping production code at Veev to POC development in Python and FastAPI — I write code that goes to production, not just demos.',
  },
  {
    category: 'Research · Strategy',
    title: 'Product & R&D',
    description:
      "Five years owning full product lifecycles: PRDs, technology evaluation, cross-functional leadership across BIM, Data, Automation, and Manufacturing. I bridge domain expertise and technical fluency to de-risk decisions before they're expensive.",
  },
  {
    category: 'Architecture · BIM',
    title: 'Architecture & Design',
    description:
      "A decade of practice across Brazil, the Netherlands, and Israel — from construction documents and BIM models to competition submissions with SOM and ARUP. Design thinking isn't a metaphor for me; it's the foundation.",
  },
]

export default function WhatIDo() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

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
      className="relative bg-canvas px-8 pt-4 pb-8 md:px-16 lg:px-24"
      style={{ zIndex: 1 }}
    >
      <div className="max-w-6xl mx-auto">
        <div
          ref={cardsRef}
          className="grid md:grid-cols-3 border border-subtle"
        >
          {CARDS.map((card, i) => (
            <article
              key={card.title}
              className={`whatiodo-card relative p-5 border-subtle cursor-default
                ${i < CARDS.length - 1 ? 'border-b md:border-b-0 md:border-r' : ''}`}
              style={{ borderWidth: '1px' }}
            >
              {/* Category tag */}
              <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-ink/40 mb-3">
                {card.category}
              </p>

              {/* Title */}
              <h3 className="font-serif text-[20px] text-ink">
                {card.title}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
