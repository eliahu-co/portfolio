import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './CardBountyPrototype.module.css'

export function CoinIcon({ small = false }: { small?: boolean }) {
  return (
    <span className={`${styles.coinIcon} ${small ? styles.coinIconSmall : ''}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <circle cx="12" cy="12" r="9" />
        <path d="m7.8 10 2.7 1.7L12 7.8l1.5 3.9 2.7-1.7-.9 5H8.7l-.9-5Z" />
      </svg>
    </span>
  )
}

export function StarRow({ count, compact = false }: { count: number; compact?: boolean }) {
  return (
    <span className={`${styles.starRow} ${compact ? styles.starRowCompact : ''}`} aria-label={`${count} Stars`}>
      {Array.from({ length: count }, (_, index) => (
        <svg key={index} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="m12 2.5 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9L12 2.5Z" />
        </svg>
      ))}
    </span>
  )
}

export function CloseGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m7 7 10 10M17 7 7 17" />
    </svg>
  )
}

export function ChevronGlyph({ direction }: { direction: 'up' | 'down' | 'left' | 'right' }) {
  const paths = {
    up: 'm6 15 6-6 6 6',
    down: 'm6 9 6 6 6-6',
    left: 'm15 6-6 6 6 6',
    right: 'm9 6 6 6-6 6',
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={paths[direction]} />
    </svg>
  )
}

export function LockGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

export function CardBack({ className = '' }: { className?: string }) {
  return (
    <span className={`${styles.cardBack} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 36 48" focusable="false">
        <rect x="1.5" y="1.5" width="33" height="45" rx="5" />
        <path d="M10 22.5 15 26l3-8 3 8 5-3.5-2 11H12l-2-11Z" />
      </svg>
    </span>
  )
}

export function PrimaryButton({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={`${styles.primaryButton} ${className}`}>
      {children}
    </button>
  )
}

export function SecondaryButton({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={`${styles.secondaryButton} ${className}`}>
      {children}
    </button>
  )
}

export function PanelTitle({ children }: { children: ReactNode }) {
  return <h2 className={styles.panelTitle}>{children}</h2>
}
