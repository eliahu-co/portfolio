// app/MA-HomeAssignment/sections/Section.tsx
// Shared section shell — gives every section a consistent anchor target,
// scroll offset (so the content isn't hidden under nothing / aligns nicely),
// an uppercase eyebrow label, and a serif heading. Mirrors the visual
// language of app/cv/page.tsx (border-t-2, Label, font-serif headings).

import type { ReactNode } from 'react'

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-cm-crimson mb-3">
      {children}
    </p>
  )
}

export default function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
}: {
  id: string
  eyebrow: string
  title?: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      // scroll-mt keeps the section heading clear of the top edge when jumped to
      className="scroll-mt-8 pt-0 pb-16"
    >
      {/* gold→crimson gradient rule replaces the flat brand border */}
      <div className="h-1 rounded-full bg-gradient-to-r from-cm-gold to-cm-crimson mb-5" aria-hidden="true" />
      <Eyebrow>{eyebrow}</Eyebrow>
      {title && (
        <h2 className={`font-serif text-[clamp(22px,3vw,32px)] leading-tight text-cm-violet-deep whitespace-pre-line ${subtitle ? 'mb-2' : 'mb-5'}`}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="font-sans text-[15px] leading-relaxed text-charcoal/80 max-w-2xl mb-6">
          {subtitle}
        </p>
      )}
      {children}
    </section>
  )
}
