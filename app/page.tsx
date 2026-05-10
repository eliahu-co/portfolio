// app/page.tsx
import FloatNav from '@/components/FloatNav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import WhatIDo from '@/components/WhatIDo'
import WorkBanner from '@/components/WorkBannerServer'
import Cursor from '@/components/Cursor'
import Nameplate from '@/components/Nameplate'
import Tooltip from '@/components/Tooltip'

export default function Home() {
  return (
    <main className="bg-canvas">
      <Tooltip />
      <Cursor />
      <FloatNav />
      <Nameplate />
      <Hero />
      <About />
      <WhatIDo />
      <WorkBanner />  {/* WorkBannerServer — auto-discovers public/architecture/ */}
    </main>
  )
}
