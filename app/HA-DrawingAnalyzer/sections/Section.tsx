// app/HA-DrawingAnalyzer/sections/Section.tsx
// Shared section shell — gives every section a consistent anchor target,
// scroll offset (so the content isn't hidden under nothing / aligns nicely),
// an uppercase eyebrow label, and a serif heading. Mirrors the visual
// language of app/cv/page.tsx (border-t-2, Label, font-serif headings).

import type { ReactNode } from 'react'

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-sans text-[9px] uppercase tracking-[0.14em] text-autodesk-blue mb-3">
      {children}
    </p>
  )
}

export default function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      // scroll-mt keeps the section heading clear of the top edge when jumped to
      className="scroll-mt-8 border-t-2 border-autodesk-blue pt-5 pb-16"
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-serif text-[clamp(26px,3.5vw,40px)] leading-tight text-black mb-5 whitespace-pre-line">
        {title}
      </h2>
      {children}
    </section>
  )
}
