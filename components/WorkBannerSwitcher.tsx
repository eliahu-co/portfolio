'use client'

import { useState, useEffect, useRef } from 'react'
import WorkBanner, { type ImageEntry } from './WorkBanner'
import { ORANGE } from '@/lib/tokens'

type SetKey = 'product' | 'architecture' | 'research' | 'design'

const CARD_TO_SET: Record<string, SetKey> = {
  'Product & Dev':          'product',
  'Architecture':           'architecture',
  'Research & Development': 'research',
  'Design':                 'design',
}

interface Props {
  sets: Record<SetKey, ImageEntry[]>
}

export default function WorkBannerSwitcher({ sets }: Props) {
  const [activeSet, setActiveSet]       = useState<SetKey>('design')
  const [overlayOpacity, setOverlay]    = useState(0)
  const pending = useRef<SetKey | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      const key = CARD_TO_SET[(e as CustomEvent<string>).detail]
      if (!key || key === activeSet) return
      pending.current = key
      setOverlay(1)
    }
    window.addEventListener('card-select', handler)
    return () => window.removeEventListener('card-select', handler)
  }, [activeSet])

  const onTransitionEnd = () => {
    if (pending.current && overlayOpacity === 1) {
      setActiveSet(pending.current)
      pending.current = null
      setOverlay(0)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <WorkBanner key={activeSet} images={sets[activeSet]} />
      <div
        aria-hidden="true"
        onTransitionEnd={onTransitionEnd}
        style={{
          position: 'absolute', inset: 0,
          background: ORANGE,
          opacity: overlayOpacity,
          transition: 'opacity 0.5s ease',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
