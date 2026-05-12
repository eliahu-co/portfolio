'use client'

import { useEffect, useState } from 'react'
import { CONTACT_LINKS } from '@/lib/site-data'

export default function Nameplate() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const el = document.getElementById('work-strip')
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { rootMargin: '0px 0px -20% 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="fixed top-6 z-50 left-8 md:left-16 lg:left-24 select-none" data-overlay-hide>
      <h1 className="text-[42px] leading-none pointer-events-none" style={{ fontFamily: 'var(--font-nabla)' }}>
        Eliahu Cohen
      </h1>

      <p
        className="font-sans text-[10px] uppercase tracking-[0.12em] text-ink mt-2 pointer-events-none"
        style={{
          opacity:    hidden ? 0 : 1,
          transform:  hidden ? 'translateY(-8px)' : 'translateY(0)',
          transition: 'opacity 0.2s, transform 0.2s',
        }}
      >
        AEC Architect. Software Developer. Builder.
      </p>

      {/* Contact links — hide when work-strip is in view */}
      <div
        className="flex flex-col gap-1 mt-3 items-start"
        style={{
          opacity:    hidden ? 0 : 1,
          transform:  hidden ? 'translateY(-8px)' : 'translateY(0)',
          transition: 'opacity 0.2s, transform 0.2s',
          pointerEvents: hidden ? 'none' : 'auto',
        }}
      >
        {CONTACT_LINKS.map(({ label, href, download, external }) => (
          <a
            key={href}
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            {...(download ? { download: true } : {})}
            className="font-sans text-[10px] uppercase tracking-[0.12em] text-ink transition-colors duration-200"
            style={{
              background: 'var(--color-gray-ui)',
              border: 'var(--border)',
              borderRadius: '2px',
              boxShadow: 'var(--shadow-card)',
              padding: '6px 12px',
              display: 'inline-block',
            }}
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  )
}
