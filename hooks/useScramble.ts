// hooks/useScramble.ts
'use client'

import { useState, useRef, useEffect } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&'

export function useScramble(initial: string) {
  const [text, setText] = useState(initial)
  const rafRef = useRef<number>(0)

  const scrambleTo = (next: string) => {
    cancelAnimationFrame(rafRef.current)
    const len = next.length
    let frame = 0
    const totalFrames = 20

    const tick = () => {
      frame++
      const resolved = Math.floor((frame / totalFrames) * len)
      const scrambled = Array.from({ length: len }, (_, i) => {
        if (i < resolved) return next[i]
        if (next[i] === ' ' || next[i] === '\n') return next[i]
        return CHARS[Math.floor(Math.random() * CHARS.length)]
      }).join('')
      setText(scrambled)
      if (frame < totalFrames) rafRef.current = requestAnimationFrame(tick)
      else setText(next)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  return { text, scrambleTo }
}
