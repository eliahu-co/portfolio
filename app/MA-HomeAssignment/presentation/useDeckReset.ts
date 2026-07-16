import { useEffect, useRef } from 'react'

export type DeckSlideKey = string | number

export function useDeckReset(reset: () => void, slideKey: DeckSlideKey): void {
  const resetRef = useRef(reset)
  const previousKeyRef = useRef<DeckSlideKey>(slideKey)

  useEffect(() => {
    resetRef.current = reset
  }, [reset])

  useEffect(() => {
    if (Object.is(previousKeyRef.current, slideKey)) return
    previousKeyRef.current = slideKey
    resetRef.current()
  }, [slideKey])
}
