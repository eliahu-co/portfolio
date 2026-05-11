'use client'

const LINKS = [
  { label: 'hi@eliahu.co',  href: 'mailto:hi@eliahu.co',                                 download: false, external: false },
  { label: 'LinkedIn ↗',    href: 'https://www.linkedin.com/in/eliahu-cohen-b32374114',  download: false, external: true  },
  { label: 'Download CV ↓', href: '/cv.pdf',                                              download: true,  external: false },
]

export default function Nameplate() {
  return (
    <div className="fixed top-6 z-50 left-8 md:left-16 lg:left-24 select-none">
      <h1 className="text-[42px] leading-none pointer-events-none" style={{ fontFamily: 'var(--font-nabla)' }}>
        Eliahu Cohen
      </h1>

      {/* Slogan — always visible */}
      <p className="font-sans text-[10px] uppercase tracking-[0.12em] text-ink mt-4 pointer-events-none">
        AEC Architect. Software Developer. Builder.
      </p>

      {/* Contact links — always visible, directly under the slogan */}
      <div className="flex flex-col gap-1 mt-3 items-start">
        {LINKS.map(({ label, href, download, external }) => (
          <a
            key={href}
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            {...(download ? { download: true } : {})}
            className="font-sans text-[10px] uppercase tracking-[0.12em] text-ink transition-colors duration-200"
            style={{
              background: '#D6BF78',
              border: 'var(--border)',
              borderRadius: '2px',
              boxShadow: '0 2px 16px rgba(26,26,26,0.08)',
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
