// app/layout.tsx
import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans, Nabla } from 'next/font/google'
import './globals.css'
import MobileGate from '@/components/MobileGate'

const cormorant = Cormorant_Garamond({
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '600', '700'],
  style:    ['normal', 'italic'],
  variable: '--font-playfair',   // keeps existing font-serif class wiring
  display:  'swap',
})

const nabla = Nabla({
  subsets:  ['latin'],
  variable: '--font-nabla',
  display:  'swap',
})

const dmSans = DM_Sans({
  subsets:  ['latin'],
  variable: '--font-inter',      // keeps existing font-sans class wiring
  display:  'swap',
})

export const metadata: Metadata = {
  title: 'Eliahu Cohen — R&D Product Architect',
  description:
    'Architect. Developer. Builder. Senior R&D Product Architect with a background in architecture and full-stack development.',
  openGraph: {
    title: 'Eliahu Cohen',
    description: 'Architect. Developer. Builder.',
    url: 'https://eliahu.co',
    siteName: 'Eliahu Cohen',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${nabla.variable}`}>
      <head>
        <link rel="preload" href="/panel.glb" as="fetch" crossOrigin="anonymous" />
      </head>
      <body>
        <MobileGate>{children}</MobileGate>
        <div className="landscape-guard" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="14" y="6" width="20" height="32" rx="3" />
            <path d="M36 10a18 18 0 0 1 0 28" />
            <path d="M33 7l3 3-3 3" />
          </svg>
          <p>Rotate to portrait</p>
        </div>
      </body>
    </html>
  )
}
