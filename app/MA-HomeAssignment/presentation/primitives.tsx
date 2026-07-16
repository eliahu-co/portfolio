import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from 'react'
import styles from './PresentationStage.module.css'

function classes(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ')
}

export interface SlideShellProps extends HTMLAttributes<HTMLDivElement> {
  align?: 'anchored' | 'centered'
}

export function SlideShell({
  align = 'anchored',
  children,
  className,
  ...props
}: SlideShellProps) {
  return (
    <div
      {...props}
      data-slide-shell="true"
      className={classes(
        'mx-auto flex h-full w-full max-w-[1280px] flex-col overflow-hidden bg-cm-cream px-20 pb-16 pt-20 font-sans text-[16px] leading-relaxed text-[#1A1A1A]',
        align === 'centered' ? 'justify-center' : 'justify-start',
        className,
      )}
    >
      {children}
    </div>
  )
}

export interface SlideTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2'
}

export function SlideTitle({
  as = 'h2',
  children,
  className,
  ...props
}: SlideTitleProps) {
  const Heading = as
  return (
    <Heading
      {...props}
      className={classes(
        'font-serif font-black text-cm-violet-deep',
        as === 'h1'
          ? 'text-[80px] leading-[0.95] tracking-[-0.02em]'
          : 'text-[64px] leading-[1.04] tracking-[-0.01em]',
        className,
      )}
    >
      {children}
    </Heading>
  )
}

export function Eyebrow({ children, className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      {...props}
      className={classes(
        'mb-4 font-sans text-[12px] font-extrabold uppercase tracking-[0.14em] text-cm-crimson',
        className,
      )}
    >
      {children}
    </p>
  )
}

export type PanelTone = 'cream' | 'violet' | 'gold' | 'crimson' | 'blue'

const PANEL_TONES: Record<PanelTone, string> = {
  cream: 'border-cm-wood/25 bg-white/70',
  violet: 'border-cm-violet-deep/25 bg-cm-violet-deep/5',
  gold: 'border-cm-gold/45 bg-cm-gold/10',
  crimson: 'border-cm-crimson/35 bg-cm-crimson/5',
  blue: 'border-[#1E7BA8]/40 bg-[#1E7BA8]/10',
}

export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  tone?: PanelTone
}

export function Panel({
  tone = 'cream',
  children,
  className,
  ...props
}: PanelProps) {
  return (
    <div
      {...props}
      className={classes(
        'rounded-2xl border px-5 py-4 text-[16px] leading-relaxed text-[#1A1A1A] shadow-[0_8px_24px_rgba(42,27,84,0.08)]',
        PANEL_TONES[tone],
        className,
      )}
    >
      {children}
    </div>
  )
}

export type PillTone = 'cream' | 'violet' | 'gold' | 'crimson' | 'blue'

const PILL_TONES: Record<PillTone, string> = {
  cream: 'border-cm-wood/30 bg-cm-cream text-cm-violet-deep',
  violet: 'border-cm-violet-deep bg-cm-violet-deep text-white',
  gold: 'border-cm-wood/60 bg-cm-gold text-cm-violet-deep',
  crimson: 'border-cm-crimson bg-cm-crimson text-white',
  blue: 'border-[#1E7BA8] bg-[#1E7BA8] text-white',
}

export interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: PillTone
}

export function Pill({ tone = 'cream', children, className, ...props }: PillProps) {
  return (
    <span
      {...props}
      className={classes(
        'inline-flex items-center rounded-full border px-3 py-1 font-sans text-[14px] font-bold leading-none',
        PILL_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function StageCounter({
  index,
  total,
  className,
  ...props
}: { index: number; total: number } & HTMLAttributes<HTMLParagraphElement>) {
  const safeTotal = Math.max(1, Math.floor(total))
  const current = Math.min(Math.max(0, Math.floor(index)), safeTotal - 1) + 1

  return (
    <p
      {...props}
      role="status"
      aria-label={`Slide ${current} of ${safeTotal}`}
      className={classes(
        'font-sans text-[12px] font-bold uppercase tabular-nums tracking-[0.12em] text-charcoal',
        className,
      )}
    >
      {current} / {safeTotal}
    </p>
  )
}

export interface RevealControlProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  summary: ReactNode
  active?: boolean
}

export function RevealControl({
  active = false,
  className,
  summary,
  type = 'button',
  ...props
}: RevealControlProps) {
  return (
    <button
      {...props}
      type={type}
      aria-expanded={active}
      data-deck-interactive="true"
      className={classes(
        styles.focusRing,
        'inline-flex min-h-11 items-center rounded-xl border-2 border-cm-wood/45 bg-white/75 px-4 py-2 font-sans text-[14px] font-bold text-cm-violet-deep transition-colors motion-reduce:transition-none hover:border-cm-gold hover:bg-cm-gold/10 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#1E7BA8]',
        className,
      )}
    >
      {summary}
    </button>
  )
}

export function PrintDetails({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      aria-hidden="true"
      data-print-details="true"
      className={classes(
        styles.printDetails,
        'mt-3 text-[14px] leading-relaxed text-charcoal',
        className,
      )}
    >
      {children}
    </div>
  )
}
