// app/layout.tsx
import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Eliahu Cohen — R&D Product Architect',
  description:
    'Architect. Developer. I actually know how to build. Senior R&D Product Architect with a background in architecture and full-stack development.',
  openGraph: {
    title: 'Eliahu Cohen',
    description: 'Architect. Developer. I actually know how to build.',
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
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
