'use client'

import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import styles from './CardBountyPrototype.module.css'

const inertAttribute = '' as unknown as boolean

export default function DemoShell({
  children,
  onRestart,
  guidance,
  finalState,
  modalActive,
  mode = 'standalone',
}: {
  children: ReactNode
  onRestart: () => void
  guidance: string
  finalState: boolean
  modalActive: boolean
  mode?: 'standalone' | 'presentation'
}) {
  const presentation = mode === 'presentation'
  const scaleStageRef = useRef<HTMLDivElement>(null)
  const [presentationScale, setPresentationScale] = useState(0.5)

  useLayoutEffect(() => {
    if (!presentation) return

    const stage = scaleStageRef.current
    if (!stage) return

    const fitPrototype = () => {
      const { width, height } = stage.getBoundingClientRect()
      if (width <= 0 || height <= 0) return
      setPresentationScale(Math.min(width / 430, height / 932))
    }

    fitPrototype()
    if (typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(fitPrototype)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [presentation])

  const gameViewport = (
    <section
      className={`${styles.gameViewport} ${presentation ? styles.gameViewportPresentation : ''}`}
      aria-label="Card Bounty game prototype"
      style={presentation
        ? ({ '--prototype-scale': presentationScale } as CSSProperties)
        : undefined}
    >
      {children}
    </section>
  )

  return (
    <main
      className={`${styles.demoRoot} ${presentation ? styles.demoRootPresentation : ''} card-bounty-demo-root`}
      data-prototype-presentation-shell={presentation ? 'true' : undefined}
      data-deck-interactive={presentation ? 'true' : undefined}
    >
      <aside
        className={`${styles.prototypeControls} ${presentation ? styles.prototypeControlsPresentation : ''} ${finalState ? styles.prototypeControlsFinal : ''}`}
        aria-label="Prototype controls"
        aria-hidden={modalActive || undefined}
        data-prototype-presentation-controls={presentation ? 'true' : undefined}
        inert={modalActive ? inertAttribute : undefined}
      >
        {presentation ? null : <p className={styles.prototypeLabel}>Interactive concept</p>}
        {presentation ? null : (
          <a href="/MA-HomeAssignment#prototype" className={styles.homeLink}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6-6 6 6 6M5 12h14" /></svg>
            Home assignment
          </a>
        )}
        <button
          type="button"
          onClick={onRestart}
          className={`${styles.restartButton} ${presentation ? styles.restartButtonPresentation : ''}`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11a8 8 0 1 1 2 5.3M4 5v6h6" /></svg>
          {presentation ? 'Restart' : 'Restart demo'}
        </button>
        {presentation ? null : <p className={styles.guidance}><span aria-hidden="true" />{guidance}</p>}
      </aside>

      {presentation ? (
        <div
          ref={scaleStageRef}
          className={styles.gameViewportScaleStage}
          data-prototype-scale-stage="true"
        >
          {gameViewport}
        </div>
      ) : gameViewport}

      {presentation ? null : (
        <div className={styles.rotateNotice} role="status">
          <div className={styles.rotateDevice} aria-hidden="true"><span /></div>
          <h1>Rotate to portrait</h1>
          <p>Card Bounty is designed as a portrait game experience.</p>
        </div>
      )}
    </main>
  )
}
