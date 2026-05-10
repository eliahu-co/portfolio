'use client'

import { useEffect, useState } from 'react'

const LINKS = [
  { label: 'hi@eliahu.co',  href: 'mailto:hi@eliahu.co',                                   download: false, external: false },
  { label: 'LinkedIn ↗',    href: 'https://www.linkedin.com/in/eliahu-cohen-b32374114',    download: false, external: true  },
  { label: 'Download CV ↓', href: '/cv.pdf',                                                download: true,  external: false },
]

export default function Nameplate() {
  const [inAbout, setInAbout] = useState(false)

  useEffect(() => {
    const target = document.getElementById('about')
    if (!target) return
    const obs = new IntersectionObserver(
      ([entry]) => setInAbout(entry.isIntersecting),
      { threshold: 0.1 },
    )
    obs.observe(target)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="fixed top-6 z-50 left-8 md:left-16 lg:left-24 select-none">
      <h1 className="font-serif text-[42px] font-bold text-ink/70 leading-none pointer-events-none">
        Eliahu Cohen
      </h1>

      {/* Slogan — fades out when in About */}
      <p
        className="font-sans text-[10px] uppercase tracking-[0.12em] text-ink/55 mt-4 pointer-events-none absolute transition-opacity duration-300"
        style={{ opacity: inAbout ? 0 : 1 }}
        aria-hidden={inAbout}
      >
        AEC Architect. Software Developer. Builder.
      </p>

      {/* Contact links — fades in when in About */}
      <div
        className="flex flex-col gap-1 mt-4 transition-opacity duration-300"
        style={{ opacity: inAbout ? 1 : 0 }}
        aria-hidden={!inAbout}
      >
        {LINKS.map(({ label, href, download, external }) => (
          <a
            key={href}
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            {...(download ? { download: true } : {})}
            className="font-sans text-[10px] uppercase tracking-[0.12em] text-ink/55 hover:text-ink transition-colors duration-200"
            tabIndex={inAbout ? 0 : -1}
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  )
}
