'use client'

// app/HA-DrawingAnalyzer/SideNav.tsx
// Sticky left-sidebar anchor nav scoped to this page. Active-state mechanism
// matches components/FloatNav.tsx (IntersectionObserver, -40% top/bottom
// rootMargin). Pills are styled after the About-section skill tags
// (components/About.tsx) — outline when inactive, filled when active — but in
// the Autodesk-blue brand colour instead of orange. Smooth-scroll is global
// (html { scroll-behavior: smooth } in globals.css).

import { useEffect, useState } from 'react'
import { SECTIONS } from './sections'

const BLUE = '#0696d7'

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
      className="ha-sidenav hidden md:block sticky top-10 self-start"
    >
      <ul className="flex flex-col items-start gap-1.5 list-none m-0 p-0">
        {SECTIONS.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={activeId === id ? 'true' : undefined}
              className="ha-sidenav-link inline-block font-sans text-[10px] uppercase tracking-[0.06em] px-2 py-0.5 rounded-sm no-underline transition-all duration-150"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      <style>{`
        .ha-sidenav-link {
          border: 2px solid ${BLUE}99;
          color: ${BLUE};
          background: transparent;
        }
        .ha-sidenav-link:hover {
          background: ${BLUE}1a;
          border-color: ${BLUE};
        }
        .ha-sidenav-link[aria-current=true] {
          background: ${BLUE};
          border-color: ${BLUE};
          color: #ffffff;
        }
        .ha-sidenav-link:focus-visible {
          outline: 1px solid ${BLUE};
          outline-offset: 2px;
        }
      `}</style>
    </nav>
  )
}
