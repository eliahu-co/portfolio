'use client'

// app/MA-HomeAssignment/SideNav.tsx
// Sticky left-sidebar anchor nav scoped to this page. Active-state mechanism
// matches components/FloatNav.tsx (IntersectionObserver, -40% top/bottom
// rootMargin). Pills are styled after the About-section skill tags
// (components/About.tsx) — outline when inactive, filled when active — but in
// the Coin Master sky-blue palette instead of orange. Smooth-scroll is global
// (html { scroll-behavior: smooth } in globals.css).

import { useEffect, useState } from 'react'
import { SECTIONS } from './sections'

const SKY = '#4FBFEF'
const TEAL = '#1D5E7E'      // dark sky-blue companion — readable on cream
const TEAL_DEEP = '#0F3D54' // text on the solid sky active pill

export default function SideNav() {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id)

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id) },
        { rootMargin: '-40% 0px -40% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((obs) => obs.disconnect())
  }, [])

  return (
    <nav
      aria-label="Section navigation"
      data-overlay-hide
      className="ma-sidenav hidden md:block sticky top-10 self-start"
    >
      <ul className="flex flex-col items-start gap-1.5 list-none m-0 p-0">
        {SECTIONS.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={activeId === id ? 'true' : undefined}
              className="ma-sidenav-link inline-block font-sans text-[10px] font-extrabold uppercase tracking-[0.06em] px-2.5 py-1 rounded-full no-underline transition-all duration-150"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      <style>{`
        /* game-button pills, same treatment as the gold CTA
           (gradient fill + hard drop edge), in the nav's sky palette */
        .ma-sidenav-link {
          background: linear-gradient(180deg, #E4F5FE, #C8EAFB);
          color: ${TEAL};
          box-shadow: 0 2px 0 ${TEAL}66;
        }
        .ma-sidenav-link:hover {
          background: linear-gradient(180deg, #D2EFFD, #A9DFF9);
          color: ${TEAL_DEEP};
        }
        .ma-sidenav-link[aria-current=true] {
          background: linear-gradient(180deg, #5FC9F5, ${SKY});
          color: ${TEAL_DEEP};
          box-shadow: 0 3px 0 ${TEAL};
        }
        .ma-sidenav-link:focus-visible {
          outline: 1px solid ${TEAL};
          outline-offset: 2px;
        }
      `}</style>
    </nav>
  )
}
