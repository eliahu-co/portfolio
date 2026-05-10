'use client'

import { useEffect, useState } from 'react'

const LINKS = [
  { label: 'hi@eliahu.co',  href: 'mailto:hi@eliahu.co',                                download: false, external: false },
  { label: 'LinkedIn ↗',    href: 'https://www.linkedin.com/in/eliahu-cohen-b32374114', download: false, external: true  },
  { label: 'Download CV ↓', href: '/cv.pdf',                                             download: true,  external: false },
]

export default function MobileGate({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)
  const [checked,  setChecked]  = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    setChecked(true)
  }, [])

  // Avoid flash: render nothing until we know the screen size
  if (!checked) return null

  if (!isMobile) return <>{children}</>

  return (
    <div className="min-h-screen w-full bg-orange-500 flex flex-col">

      {/* Top disclaimer */}
      <p className="w-full text-center font-sans text-[5vw] uppercase tracking-[0.08em] text-white py-5 px-6 bg-[#009c3b]">
        For portfolio open on a desktop browser
      </p>

      {/* Name + slogan — vertically centred in remaining space */}
      <div className="flex-1 flex flex-col items-start justify-center px-6">
        <h1 className="text-[22vw] text-white leading-[1] tracking-tight" style={{ fontFamily: 'var(--font-nabla)' }}>
          Eliahu<br />Cohen
        </h1>
      </div>

      {/* Links — pinned to bottom */}
      <div className="flex flex-col gap-5 px-6 pb-12">
        {LINKS.map(({ label, href, download, external }) => (
          <a
            key={href}
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            {...(download ? { download: true } : {})}
            className="font-sans text-[7vw] uppercase tracking-[0.06em] text-white leading-none active:text-white/60 transition-colors duration-150"
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  )
}
