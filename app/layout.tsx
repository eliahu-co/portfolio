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
      <body><MobileGate>{children}</MobileGate></body>
    </html>
  )
}
