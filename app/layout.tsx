// app/layout.tsx
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import MobileGate from '@/components/MobileGate'

const cormorant = localFont({
  src: [
    {
      path: './fonts/cormorant-garamond-latin-variable.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/cormorant-garamond-latin-variable.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/cormorant-garamond-latin-variable.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/cormorant-garamond-latin-variable.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/cormorant-garamond-latin-variable.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/cormorant-garamond-latin-variable-italic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: './fonts/cormorant-garamond-latin-variable-italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: './fonts/cormorant-garamond-latin-variable-italic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: './fonts/cormorant-garamond-latin-variable-italic.woff2',
      weight: '600',
      style: 'italic',
    },
    {
      path: './fonts/cormorant-garamond-latin-variable-italic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-playfair',   // keeps existing font-serif class wiring
  display:  'swap',
  adjustFontFallback: 'Times New Roman',
})

const nabla = localFont({
  src: './fonts/nabla-latin.woff2',
  weight: '400',
  style: 'normal',
  variable: '--font-nabla',
  display:  'swap',
})

const dmSans = localFont({
  src: './fonts/dm-sans-latin-variable.woff2',
  weight: '100 1000',
  style: 'normal',
  variable: '--font-inter',      // keeps existing font-sans class wiring
  display:  'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://eliahu.co'),
  title: 'Eliahu Cohen — R&D Product Architect',
  description:
    'Architect. Product Manager. Builder. Senior R&D Product Architect with a background in architecture and full-stack development.',
  openGraph: {
    title: 'Eliahu Cohen',
    description: 'Architect. Product Manager. Builder.',
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
        <div className="landscape-guard" aria-hidden="true" />
      </body>
    </html>
  )
}
