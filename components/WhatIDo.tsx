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
      className="bg-canvas px-8 py-32 md:px-16 lg:px-24"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="font-serif text-[clamp(32px,4vw,48px)] text-ink mb-16">
          What I do
        </h2>

        <div
          ref={cardsRef}
          className="grid md:grid-cols-3 border border-subtle"
        >
          {CARDS.map((card, i) => (
            <article
              key={card.title}
              className={`whatiodo-card group relative p-8 border-subtle cursor-default
                ${i < CARDS.length - 1 ? 'border-b md:border-b-0 md:border-r' : ''}
                hover:border-ink transition-colors duration-300`}
              style={{ borderWidth: '1px' }}
            >
              {/* Category tag */}
              <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-ink/40 mb-6">
                {card.category}
              </p>

              {/* Title — slides up on hover */}
              <h3 className="font-serif text-[28px] text-ink mb-4 transition-transform duration-300 group-hover:-translate-y-2">
                {card.title}
              </h3>

              {/* Arrow */}
              <span
                className="absolute bottom-8 right-8 text-ink/30 text-base transition-opacity duration-300 group-hover:opacity-0"
                aria-hidden="true"
              >
                →
              </span>

              {/* Description — fades in on hover */}
              <p className="font-sans text-[14px] leading-[1.7] text-ink/70 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
