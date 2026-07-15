import { useState } from 'react'
import { formatNumber } from './demoData'
import { REEL_GRID } from './demoVisualData'
import { CardBack } from './GamePrimitives'
import { SlotMachineBoard } from './SlotMachineBoard'
import styles from './SpinReturnScreen.module.css'

export default function SpinReturnScreen({
  coins,
  spins,
  reward,
  targetName,
  onCardsCenter,
}: {
  coins: number
  spins: number
  reward: number
  targetName: string
  onCardsCenter: () => void
}) {
  const [spinReady, setSpinReady] = useState(false)
  const [spinCycle, setSpinCycle] = useState(0)
  const completedCollection = reward > 0

  const startSpin = () => {
    setSpinReady(true)
    setSpinCycle((cycle) => cycle + 1)
  }

  return (
    <div className={styles.spinScreen}>
      <header className={styles.resourceBar} aria-label="Player resources">
        <span
          className={`${styles.resourceCapsule} ${styles.coinCapsule}`}
          role="group"
          aria-label={`Coin balance: ${formatNumber(coins)}`}
        >
          <span className={styles.resourceIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="m7.8 10 2.7 1.7L12 7.8l1.5 3.9 2.7-1.7-.9 5H8.7l-.9-5Z" /></svg>
          </span>
          <span className={styles.visuallyHidden}>Coins</span>
          <strong>{formatNumber(coins)}</strong>
        </span>
        <span
          className={`${styles.resourceCapsule} ${styles.gemCapsule}`}
          role="group"
          aria-label="Gem balance: 120"
        >
          <span className={styles.resourceIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="m12 2 7.5 6.2L12 22 4.5 8.2 12 2Z" /><path d="m4.5 8.2 7.5 2.5 7.5-2.5M12 2v8.7" /></svg>
          </span>
          <span className={styles.visuallyHidden}>Gems</span>
          <strong>120</strong>
        </span>
        <span
          className={`${styles.resourceCapsule} ${styles.energyCapsule}`}
          role="group"
          aria-label={`Spin balance: ${formatNumber(spins)}`}
        >
          <span className={styles.resourceIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="m13.6 2-8 11h5.2L9.7 22l8.7-12h-5.3L13.6 2Z" /></svg>
          </span>
          <span className={styles.visuallyHidden}>Spins</span>
          <strong>{formatNumber(spins)}</strong>
        </span>
        <button className={styles.menuButton} type="button" aria-label="Open game menu">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h14" /></svg>
        </button>
      </header>

      <div className={styles.playerPlaque}>
        <span className={styles.playerAvatar} aria-hidden="true">
          <img src="/coinmaster/card-bounty/generated/spin/pet.webp" alt="" />
        </span>
        <span>
          <small>Level 225</small>
          <strong>Snowbound</strong>
        </span>
      </div>

      <button className={`${styles.eventBadge} ${styles.shopButton}`} type="button" aria-label="Shop">
        <img src="/coinmaster/card-bounty/wooden-chest.webp" alt="" aria-hidden="true" />
        <span>Shop</span>
      </button>
      <aside className={`${styles.eventBadge} ${styles.tournamentEvent}`} aria-label="Tournament event">
        <img src="/coinmaster/card-bounty/generated/spin/event-tournament.webp" alt="" aria-hidden="true" />
        <span>12m</span>
      </aside>

      <div className={styles.boardStage}>
        <SlotMachineBoard symbols={REEL_GRID} spinCycle={spinCycle} />
      </div>

      <section className={styles.spinControls} aria-label="Energy and Spins">
        <div className={styles.energyMeter}>
          <span><small>Energy</small><strong>80/80</strong></span>
          <div
            className={styles.energyTrack}
            role="progressbar"
            aria-label="Energy"
            aria-valuemin={0}
            aria-valuemax={80}
            aria-valuenow={80}
          >
            <span />
          </div>
        </div>
        <div className={styles.spinBalance}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13.6 2-8 11h5.2L9.7 22l8.7-12h-5.3L13.6 2Z" /></svg>
          <span><small>Spins</small><strong>{formatNumber(spins)}</strong></span>
        </div>
      </section>

      <button
        type="button"
        className={styles.spinButton}
        aria-label="Spin"
        aria-pressed={spinReady}
        onClick={startSpin}
      >
        <span>Spin</span>
      </button>

      <button
        type="button"
        className={styles.cardsCenterButton}
        aria-label="Cards Center"
        onClick={onCardsCenter}
      >
        <CardBack className={styles.cardsCenterIcon} />
        <span>Cards Center</span>
      </button>

      <div className={styles.rewardStatus} role="status" aria-live="polite">
        <span className={styles.statusCheck} aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="m6 12 4 4 8-9" /></svg>
        </span>
        <span>
          <strong>{spinReady ? 'Core loop ready' : completedCollection ? 'Reward added' : 'Bounty Card added'}</strong>
          <small>
            {spinReady
              ? 'Reels reset with the same outcome'
              : completedCollection
                ? `Collection reward: +${formatNumber(reward)} Spins`
                : `${targetName} secured`}
          </small>
        </span>
      </div>
    </div>
  )
}
