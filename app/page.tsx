// app/page.tsx
import FloatNav from '@/components/FloatNav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import WhatIDo from '@/components/WhatIDo'
import Contact from '@/components/Contact'
import Cursor from '@/components/Cursor'

export default function Home() {
  return (
    <main className="bg-canvas">
      <Cursor />
      <FloatNav />

      {/* Fixed nameplate — top-left, persists across all sections */}
      <div className="fixed top-6 z-50 pointer-events-none select-none" style={{ left: 'max(6rem, calc((100vw - 72rem) / 2))' }}>
        <h1 className="font-serif text-[42px] font-bold text-ink/70 leading-none">
          Eliahu Cohen
        </h1>
        <p className="font-sans text-[10px] uppercase tracking-[0.12em] text-ink/55 mt-1">
          AEC Architect. Software Developer. Builder.
        </p>
      </div>
      <Hero />
      <About />
      <WhatIDo />
      <Contact />
    </main>
  )
}
