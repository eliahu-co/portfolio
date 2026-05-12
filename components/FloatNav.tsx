'use client'

import { useEffect, useState } from 'react'
import { NAV_LINKS } from '@/lib/site-data'

export default function FloatNav() {
  const [progress, setProgress] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [activeId, setActiveId] = useState<string>('hero')

  useEffect(() => {
    const onScroll = () => {
      const { scrollY, innerHeight } = window
      const max = document.body.scrollHeight - innerHeight
      setProgress(max > 0 ? scrollY / max : 0)
      setScrolled(scrollY > innerHeight * 0.9)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    NAV_LINKS.forEach(({ id }) => {
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
    <>
      <nav
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 overflow-hidden"
        data-overlay-hide
        style={{
          background: 'var(--color-gray-ui)',
          border: 'var(--border)',
          borderRadius: '2px',
          boxShadow: 'var(--shadow-card)',
        }}
        aria-label="Page navigation"
      >
        {/* Progress bar */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'var(--color-subtle)',
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: '100%',
              background: 'var(--color-ink)',
              transition: 'width 0.1s linear',
            }}
          />
        </div>

        {/* Nav links */}
        <ul className="flex items-center list-none m-0" style={{ padding: '14px 4px 12px' }}>
          {NAV_LINKS.map(({ label, href, id }, i) => (
            <li key={href}>
              <a
                href={href}
                className="floatnav-link"
                aria-current={activeId === id ? 'page' : undefined}
                style={{
                  display: 'block',
                  fontSize: '10px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ink)',
                  textDecoration: 'none',
                  padding: '0 18px',
                  opacity: 1,
                  fontWeight: 400,
                  whiteSpace: 'nowrap',
                  borderRight: i < NAV_LINKS.length - 1 ? '1px solid var(--color-ink)' : undefined,
                }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Scroll-to-top button */}
      <button
        type="button"
        className="floatnav-btn"
        data-overlay-hide
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
        tabIndex={scrolled ? 0 : -1}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 50,
          width: '34px',
          height: '34px',
          background: 'var(--color-gray-ui)',
          borderRadius: '2px',
          border: 'var(--border)',
          boxShadow: 'var(--shadow-card)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: scrolled ? 1 : 0,
          pointerEvents: scrolled ? 'auto' : 'none',
          transition: 'opacity 0.2s, transform 0.2s',
          transform: scrolled ? 'translateY(0)' : 'translateY(8px)',
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 13 13"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M2 9l4.5-4.5L11 9" />
        </svg>
      </button>
      <style>{`
        .floatnav-link:focus-visible {
          outline: 1px solid var(--color-ink);
          outline-offset: 2px;
        }
        .floatnav-btn:focus-visible {
          outline: 1px solid var(--color-ink);
          outline-offset: 2px;
        }
      `}</style>
    </>
  )
}
