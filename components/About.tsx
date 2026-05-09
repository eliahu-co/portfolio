// components/About.tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

const SKILL_TAGS = ['Product', 'BIM', 'ConTech', 'React · Node.js', 'Digital Twin', 'CAD-to-CAM']

export default function About() {
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(leftRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: leftRef.current,
          start: 'top 80%',
          once: true,
        },
      })
      gsap.from(rightRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: rightRef.current,
          start: 'top 80%',
          once: true,
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" className="bg-canvas px-8 py-32 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">

        {/* Left column */}
        <div ref={leftRef}>
          {/* Decorative number */}
          <div
            className="font-serif text-[160px] leading-none text-subtle select-none"
            aria-hidden="true"
          >
            01
          </div>
          <h2 className="font-serif text-[clamp(24px,3vw,36px)] text-ink -mt-16 leading-tight">
            The intersection of design thinking and technical fluency.
          </h2>
        </div>

        {/* Right column */}
        <div ref={rightRef} className="pt-4">
          <p className="font-sans text-[15px] leading-relaxed text-ink/80 mb-10">
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
