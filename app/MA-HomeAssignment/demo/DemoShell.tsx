import type { ReactNode } from 'react'
import styles from './CardBountyPrototype.module.css'

const inertAttribute = '' as unknown as boolean

export default function DemoShell({
  children,
  onRestart,
  guidance,
  finalState,
  modalActive,
}: {
  children: ReactNode
  onRestart: () => void
  guidance: string
  finalState: boolean
  modalActive: boolean
}) {
  return (
    <main className={`${styles.demoRoot} card-bounty-demo-root`}>
      <div className={styles.skyGlow} aria-hidden="true" />
      <div className={`${styles.floatingCoin} ${styles.coinOne}`} aria-hidden="true"><span>M</span></div>
      <div className={`${styles.floatingCoin} ${styles.coinTwo}`} aria-hidden="true"><span>M</span></div>
      <div className={`${styles.floatingCoin} ${styles.coinThree}`} aria-hidden="true"><span>M</span></div>

      <aside
        className={`${styles.prototypeControls} ${finalState ? styles.prototypeControlsFinal : ''}`}
        aria-label="Prototype controls"
        aria-hidden={modalActive || undefined}
        inert={modalActive ? inertAttribute : undefined}
      >
        <p className={styles.prototypeLabel}>Interactive concept</p>
        <a href="/MA-HomeAssignment#prototype" className={styles.homeLink}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6-6 6 6 6M5 12h14" /></svg>
          Home assignment
        </a>
        <button type="button" onClick={onRestart} className={styles.restartButton}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11a8 8 0 1 1 2 5.3M4 5v6h6" /></svg>
          Restart demo
        </button>
        <p className={styles.guidance}><span aria-hidden="true" />{guidance}</p>
      </aside>

      <section className={styles.gameViewport} aria-label="Card Bounty game prototype">
        {children}
      </section>

      <div className={styles.rotateNotice} role="status">
        <div className={styles.rotateDevice} aria-hidden="true"><span /></div>
        <h1>Rotate to portrait</h1>
        <p>Card Bounty is designed as a portrait game experience.</p>
      </div>
    </main>
  )
}
