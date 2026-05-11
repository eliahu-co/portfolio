'use client'

import { useState, useEffect } from 'react'
import WorkBanner, { type ImageEntry } from './WorkBanner'

interface Props {
  architecture: ImageEntry[]
  design:       ImageEntry[]
}

export default function WorkBannerSwitcher({ architecture, design }: Props) {
  const [set, setSet] = useState<'architecture' | 'design'>('design')

  useEffect(() => {
    const handler = (e: Event) => {
      const title = (e as CustomEvent<string>).detail
      setSet(title === 'Design' ? 'design' : 'architecture')
    }
    window.addEventListener('card-select', handler)
    return () => window.removeEventListener('card-select', handler)
  }, [])

  return <WorkBanner key={set} images={set === 'design' ? design : architecture} />
}
