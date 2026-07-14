import type { CSSProperties } from 'react'
import { DUPLICATE_REVEALS, formatNumber, getChest, type DemoTarget } from './demoData'
import type { DemoState } from './demoReducer'
import { CoinIcon, PrimaryButton, StarRow } from './GamePrimitives'
import styles from './CardBountyPrototype.module.css'

export function ChestOpening({ state, onContinue }: { state: DemoState; onContinue: () => void }) {
  const chest = getChest(state.pendingPurchase?.chestId ?? null)
  const quantity = state.pendingPurchase?.quantity ?? 1
  if (!chest) return null
  const totalCards = chest.cardsPerChest * quantity
  const revealedCards = DUPLICATE_REVEALS.slice(0, totalCards)
  const chestImage = chest.id === 'magical'
    ? '/coinmaster/card-bounty/generated/magical-chest-open.webp'
    : chest.image

  return (
    <section className={`${styles.rewardScreen} ${styles.chestOpeningScreen}`} role="dialog" aria-modal="true" aria-labelledby="chest-opening-title">
      <div className={styles.rewardBalance}><CoinIcon small /><span>{formatNumber(state.coins)}</span></div>
      <div className={styles.openingBurst} aria-hidden="true"><span /><span /><span /></div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={chestImage} alt="" className={styles.openedChest} />
      <p className={styles.kicker}>Chest opening complete</p>
      <h2 id="chest-opening-title">Duplicate Cards</h2>
      <p className={styles.openingSubhead}>
        {quantity} {quantity === 1 ? 'Chest' : 'Chests'} · {totalCards} Cards
        {totalCards > revealedCards.length ? ` · ${revealedCards.length} shown` : ''}
      </p>
      <div className={styles.revealCards}>
        {revealedCards.map((card, index) => (
          <div key={card.name} style={{ '--reveal-index': index } as CSSProperties}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={card.image} alt={`${card.name} duplicate Card`} />
            <span>Duplicate</span>
          </div>
        ))}
      </div>
      <div className={styles.progressEarned}>
        <span>Bounty progress earned</span>
        <strong>+{state.lastProgressEarned} Bounty progress</strong>
      </div>
      <p className={styles.deterministicNote}>Representative predetermined reveal · No drop-odds simulation</p>
      <PrimaryButton type="button" onClick={onContinue} autoFocus>Continue</PrimaryButton>
    </section>
  )
}

export function GuaranteeReveal({ target, threshold, onClaim }: { target: DemoTarget; threshold: number; onClaim: () => void }) {
  return (
    <section className={`${styles.rewardScreen} ${styles.guaranteeScreen}`} role="dialog" aria-modal="true" aria-labelledby="guarantee-title">
      <div className={styles.guaranteeRays} aria-hidden="true" />
      <p className={styles.kicker}>{threshold}/{threshold} · Guaranteed Card unlocked</p>
      <h2 id="guarantee-title">Bounty Complete</h2>
      <div className={styles.guaranteedCardWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={target.image} alt={`${target.name} guaranteed Card`} />
        <span>Guaranteed</span>
      </div>
      <StarRow count={target.stars} />
      <h3>{target.name}</h3>
      <p>Earned from the filled Bounty meter, separately from normal Chest contents.</p>
      <div className={styles.completeMeter}><span /><strong>{threshold}/{threshold}</strong></div>
      <PrimaryButton type="button" onClick={onClaim} autoFocus>Add to Collection</PrimaryButton>
    </section>
  )
}

export function CollectionComplete({ target, onCollect }: { target: DemoTarget; onCollect: () => void }) {
  const completesCollection = target.collectionProgress === 8
  const updatedProgress = Math.min(9, target.collectionProgress + 1)

  return (
    <section className={`${styles.rewardScreen} ${styles.collectionCompleteScreen}`} role="dialog" aria-modal="true" aria-labelledby="collection-complete-title">
      <p className={styles.kicker}>Card added</p>
      <h2 id="collection-complete-title">
        {completesCollection ? `${target.collection} — Collection Completed` : `${target.collection} — Card Added`}
      </h2>
      <div className={styles.completedSet}>
        <div className={styles.completedCards}>
          {DUPLICATE_REVEALS.map((card) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={card.image} alt="" key={card.name} />
          ))}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={target.image} alt={`${target.name} added to ${target.collection}`} className={styles.completedTarget} />
        </div>
        <div className={styles.collectionProgressShift}>
          <span>{target.collectionProgress}/9</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>
          <strong>{updatedProgress}/9</strong>
        </div>
      </div>
      {completesCollection ? (
        <div className={styles.spinReward}>
          <svg viewBox="0 0 36 36" aria-hidden="true"><path d="m18 3.5 4 8.1 9 .9-6.5 6.3 1.7 8.8-8.2-4.3-8.2 4.3 1.7-8.8L5 12.5l9-.9 4-8.1Z" /></svg>
          <span>Collection reward</span>
          <strong>+{formatNumber(target.collectionRewardSpins)} Spins</strong>
        </div>
      ) : (
        <p className={styles.collectionResultNote}>
          {target.name} moved {target.collection} to {updatedProgress}/9. The Bounty is complete; the Collection reward remains locked.
        </p>
      )}
      <PrimaryButton
        type="button"
        onClick={onCollect}
        aria-label={completesCollection ? `Collect ${formatNumber(target.collectionRewardSpins)} Spins` : 'Return to Spin screen'}
        autoFocus
      >
        {completesCollection ? 'Collect' : 'Return to Spin'}
      </PrimaryButton>
    </section>
  )
}
