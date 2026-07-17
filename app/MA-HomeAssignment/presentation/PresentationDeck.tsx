'use client'

import {
  useCallback,
  useEffect,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { useRouter } from 'next/navigation'
import {
  clampIndex,
  hashForIndex,
  indexFromHash,
  isDeckInteractiveTarget,
  stepIndex,
} from './nav'
import { StageCounter } from './primitives'
import {
  closingMenuTargets,
  slideCount,
  slideRegistry,
} from './slideRegistry'
import styles from './PresentationStage.module.css'
import { FlowArrow } from './components/FlowArrow'

const inertAttribute = '' as unknown as boolean

function joinClasses(...values: Array<string | false | undefined>): string {
  return values.filter(Boolean).join(' ')
}

export default function PresentationDeck() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [hashReady, setHashReady] = useState(false)
  const activeSlide = slideRegistry[current]

  const navigate = useCallback((index: number) => {
    setCurrent(clampIndex(index, slideCount))
  }, [])

  useEffect(() => {
    const syncFromLocation = () => {
      const next = indexFromHash(window.location.hash, slideCount)
      setCurrent(next)

      const canonicalHash = hashForIndex(next)
      if (window.location.hash !== canonicalHash) {
        window.history.replaceState(window.history.state, '', canonicalHash)
      }
    }

    syncFromLocation()
    setHashReady(true)
    window.addEventListener('hashchange', syncFromLocation)
    window.addEventListener('popstate', syncFromLocation)
    return () => {
      window.removeEventListener('hashchange', syncFromLocation)
      window.removeEventListener('popstate', syncFromLocation)
    }
  }, [])

  useEffect(() => {
    if (!hashReady) return
    const hash = hashForIndex(current)
    if (window.location.hash !== hash) {
      window.history.replaceState(window.history.state, '', hash)
    }
  }, [current, hashReady])

  useEffect(() => {
    document.body.classList.add('ma-presentation-active')
    return () => document.body.classList.remove('ma-presentation-active')
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return

      if (event.key === 'Escape') {
        router.push('/MA-HomeAssignment')
        return
      }

      if (isDeckInteractiveTarget(event.target)) return

      if (event.key === 'ArrowRight' || (event.key === ' ' && !event.shiftKey)) {
        event.preventDefault()
        setCurrent((index) => stepIndex(index, 1, slideCount))
        return
      }

      if (event.key === 'ArrowLeft' || (event.key === ' ' && event.shiftKey)) {
        event.preventDefault()
        setCurrent((index) => stepIndex(index, -1, slideCount))
        return
      }

    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [router])

  const handleDeckClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    const target = event.target instanceof Element
      ? event.target.closest<HTMLAnchorElement>('a[href^="#slide-"]')
      : null
    if (!target) return

    const href = target.getAttribute('href') ?? ''
    const index = indexFromHash(href, slideCount)
    if (hashForIndex(index) !== href) return

    event.preventDefault()
    navigate(index)
  }

  return (
    <div
      className={joinClasses(
        styles.viewport,
      )}
      data-presentation-viewport="true"
      data-viewport-supported="true"
      data-current-slide={activeSlide.id}
      onClick={handleDeckClick}
    >
      <div className={styles.stageFrame}>
        <div className={styles.stage} data-slide-registry-tree="true">
          {slideRegistry.map((slide, index) => {
            const isActive = index === current
            const { Component } = slide

            return (
              <section
                key={slide.id}
                id={slide.id}
                aria-label={`${index + 1}. ${slide.title}`}
                aria-hidden={isActive ? undefined : true}
                inert={isActive ? undefined : inertAttribute}
                data-deck-slide="true"
                data-active-slide={isActive ? 'true' : 'false'}
                className={joinClasses(
                  styles.slide,
                  isActive ? styles.activeSlide : styles.inactiveSlide,
                )}
              >
                <Component
                  slideKey={activeSlide.id}
                  isActive={isActive}
                  chapterLinks={closingMenuTargets}
                />
              </section>
            )
          })}

          <nav
            aria-label="Presentation controls"
            className={styles.deckChrome}
          >
            <div className={styles.previousControl}>
              {current > 0 && (
                <button
                  type="button"
                  aria-label={`Previous: ${slideRegistry[current - 1].shortTitle}`}
                  onClick={() => navigate(current - 1)}
                >
                  <FlowArrow direction="left" className="h-[12px] w-[18px]" />
                  {slideRegistry[current - 1].shortTitle}
                </button>
              )}
            </div>

            <StageCounter index={current} total={slideCount} />

            <div className={styles.nextControl}>
              {current < slideCount - 1 && (
                <button
                  type="button"
                  aria-label={`Next: ${slideRegistry[current + 1].shortTitle}`}
                  onClick={() => navigate(current + 1)}
                >
                  {slideRegistry[current + 1].shortTitle}
                  <FlowArrow direction="right" className="h-[12px] w-[18px]" />
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}
