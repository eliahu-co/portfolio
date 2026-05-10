// app/page.tsx
import FloatNav from '@/components/FloatNav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import WhatIDo from '@/components/WhatIDo'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <main className="bg-canvas">
      <FloatNav />
      <Hero />
      <About />
      <WhatIDo />
      <Contact />
    </main>
  )
}
