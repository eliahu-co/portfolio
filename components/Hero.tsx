// components/Hero.tsx
'use client'

import dynamic from 'next/dynamic'

const PanelScene = dynamic(() => import('./PanelScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0" style={{ backgroundColor: '#D6D6D6' }} />,
})

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative h-screen w-full overflow-hidden"
      style={{ backgroundColor: '#D6D6D6' }}
    >
      {/* Three.js canvas — fills entire section */}
      <PanelScene />

      {/* Text overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none px-6">
        <h1 className="font-serif text-[clamp(40px,6vw,72px)] font-bold text-ink leading-none">
          Eliahu Cohen
        </h1>

        {/* Divider rule */}
        <div className="w-8 h-px bg-ink/20 my-4" />

        <p className="font-sans text-[13px] uppercase tracking-[0.12em] text-ink/60">
          AEC Architect. Software Developer. Builder.
        </p>
      </div>

      {/* Scroll CTA */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none">
        <span className="font-sans text-[11px] uppercase tracking-[0.12em] text-ink/40">
          Scroll to explore
        </span>
        <svg
          className="animate-bounce-y w-4 h-4 text-ink/40"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M2 5l6 6 6-6" />
        </svg>
      </div>
    </section>
  )
}
