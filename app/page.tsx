// app/page.tsx
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import WhatIDo from '@/components/WhatIDo'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <main className="bg-canvas">
      <Nav />
      <Hero />
      <About />
      <WhatIDo />
      <Contact />
    </main>
  )
}
