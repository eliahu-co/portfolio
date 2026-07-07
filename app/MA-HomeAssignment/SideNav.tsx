'use client'

// app/MA-HomeAssignment/SideNav.tsx
// Sticky left-sidebar anchor nav scoped to this page. Active-state mechanism
// matches components/FloatNav.tsx (IntersectionObserver, -40% top/bottom
// rootMargin). Pills are styled after the About-section skill tags
// (components/About.tsx) — outline when inactive, filled when active — but in
// the Coin Master gold/wood palette instead of orange. Smooth-scroll is global
// (html { scroll-behavior: smooth } in globals.css).

import { useEffect, useState } from 'react'
import { SECTIONS } from './sections'

const GOLD = '#F5A800'
const WOOD = '#903900'
const CRIMSON = '#C8102E'
const VIOLET = '#2A1B54'

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
              className="ma-sidenav-link inline-block font-sans text-[10px] uppercase tracking-[0.06em] px-2 py-0.5 rounded-sm no-underline transition-all duration-150"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      <style>{`
        .ma-sidenav-link {
          border: 2px solid ${GOLD}99;
          color: ${WOOD};
          background: transparent;
        }
        .ma-sidenav-link:hover {
          background: ${CRIMSON}1a;
          border-color: ${CRIMSON};
          color: ${CRIMSON};
        }
        .ma-sidenav-link[aria-current=true] {
          background: ${GOLD};
          border-color: ${GOLD};
          color: ${VIOLET};
        }
        .ma-sidenav-link:focus-visible {
          outline: 1px solid ${WOOD};
          outline-offset: 2px;
        }
      `}</style>
    </nav>
  )
}
