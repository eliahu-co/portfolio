// components/Nav.tsx
'use client'

import { useEffect, useState } from 'react'

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'What I do', href: '#what-i-do' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.9)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navBase = 'fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 transition-all duration-200'
  const navStyle = scrolled
    ? 'bg-canvas border-b border-subtle text-ink'
    : 'bg-transparent text-white'

  return (
    <nav className={`${navBase} ${navStyle}`} role="navigation">
      {/* Logo */}
      <a
        href="#hero"
        className="font-serif text-xl font-bold tracking-tight hover:opacity-70 transition-opacity"
      >
        EC
      </a>

      {/* Desktop links */}
      <ul className="hidden md:flex gap-8 list-none">
        {LINKS.map(({ label, href }) => (
          <li key={href}>
            <a
              href={href}
              className="font-sans text-[13px] uppercase tracking-widest hover:opacity-60 transition-opacity"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex flex-col gap-[5px] p-2"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
      >
        <span className={`block w-6 h-px bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
        <span className={`block w-6 h-px bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
        <span className={`block w-6 h-px bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
      </button>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-ink flex flex-col items-center justify-center gap-10 z-40 md:hidden">
          {LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="font-serif text-3xl text-canvas hover:opacity-60 transition-opacity"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
