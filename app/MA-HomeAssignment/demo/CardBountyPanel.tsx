import { BountyMeter } from './BountyMeter'
import { CHESTS, formatCompactCoins, formatCountdown, formatNumber, type DemoTarget } from './demoData'
import type { DemoState } from './demoReducer'
import {
  CardBack,
  CoinIcon,
  LockGlyph,
  PrimaryButton,
  SecondaryButton,
} from './GamePrimitives'
import styles from './BountyPanels.module.css'

export function IntroPanel({
  countdown,
  onChoose,
}: {
  countdown: number
  onChoose: () => void
}) {
  return (
    <div className={styles.introPanel}>
      <div className={styles.eventMeta}>
        <span>Live event</span>
        <time>Ends in {formatCountdown(countdown)}</time>
      </div>
      <div className={styles.bountyIllustration} aria-hidden="true">
        <CardBack className={styles.introCardBack} />
        <span className={styles.targetReticle}><span /></span>
      </div>
      <h3>Hunt your missing Card</h3>
      <p>Choose a missing Card. Coin-purchased Chests fill the Bounty meter. Fill it to guarantee your target.</p>
      <div className={styles.ruleChips} aria-label="Card Bounty rules">
        <span>1 target</span>
        <span>Coin Chests only</span>
        <span>Guaranteed when full</span>
      </div>
      <PrimaryButton type="button" onClick={onChoose}>Choose a Card</PrimaryButton>
    </div>
  )
}

export function TargetConfirmation({
  target,
  countdown,
  onBack,
  onSelect,
}: {
  target: DemoTarget
  countdown: number
  onBack: () => void
  onSelect: () => void
}) {
  return (
    <div className={styles.confirmationPanel}>
      <div className={styles.eventMeta}>
        <span>Your target</span>
        <time>Ends in {formatCountdown(countdown)}</time>
      </div>
      <div className={styles.confirmationCardWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={target.image} alt={`${target.name} Card`} className={styles.confirmationCard} />
        <span className={styles.eligibilityTag}>Regular &middot; Tradable</span>
      </div>
      <div className={styles.confirmationCopy}>
        <h3>{target.name}</h3>
        <p>{target.collection} &middot; {target.collectionProgress}/9 Cards &middot; {target.stars} Stars</p>
        <small>Complete the Collection to win <strong>{formatNumber(target.collectionRewardSpins)} Spins</strong></small>
      </div>
      <div className={styles.requiredProgress}>
        <span>Required Bounty progress</span>
        <strong>{target.bountyThreshold}</strong>
      </div>
      <div className={styles.confirmationActions}>
        <SecondaryButton type="button" onClick={onBack}>Back</SecondaryButton>
        <PrimaryButton type="button" onClick={onSelect} aria-label="Select target">Select</PrimaryButton>
      </div>
    </div>
  )
}

export function ActiveBountyPanel({
  state,
  target,
  onChange,
  onChest,
}: {
  state: DemoState
  target: DemoTarget
  onChange: () => void
  onChest: (chestId: 'wooden' | 'golden' | 'magical') => void
}) {
  return (
    <div className={styles.activePanel}>
      <div className={styles.activeTopline}>
        <time>Ends in {formatCountdown(state.eventSecondsRemaining)}</time>
        <div className={styles.balanceStrip} aria-label={`${formatNumber(state.coins)} Coins`}>
          <CoinIcon small />
          <span>Coins</span>
          <strong>{formatNumber(state.coins)}</strong>
        </div>
      </div>

      <section className={styles.activeTarget} aria-label="Selected target">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={target.image} alt={`${target.name} Card`} />
        <div>
          <p>Selected Card</p>
          <h3>{target.name}</h3>
          <span>{target.collection} &middot; {target.collectionProgress}/9</span>
        </div>
        <button
          type="button"
          className={`${styles.changeButton} ${state.targetLocked ? styles.changeButtonLocked : ''}`}
          onClick={onChange}
          disabled={state.targetLocked}
        >
          {state.targetLocked ? <><LockGlyph /><span>Target locked</span></> : 'Change'}
        </button>
      </section>

      <div className={styles.meterSection}>
        <div className={styles.meterCaption}>
          <span>300-point target</span>
          <strong aria-hidden="true">{state.meterProgress}/{state.meterThreshold}</strong>
        </div>
        <BountyMeter
          label="Bounty progress"
          progress={state.meterProgress}
          threshold={state.meterThreshold}
          targetImage={target.image}
          variant="compact"
        />
      </div>

      <div className={styles.chestHeading}>
        <div><p>Coin-purchased Chests</p><h3>Choose a Chest</h3></div>
        <p>Higher-value Chests add more Bounty progress.</p>
      </div>

      <div className={styles.chestGrid}>
        {CHESTS.map((chest) => (
          <button
            type="button"
            key={chest.id}
            aria-label={`Buy ${chest.name}, ${formatCompactCoins(chest.price)} Coins, ${chest.cardsPerChest} Cards per Chest, +${chest.bountyProgress} Bounty progress`}
            onClick={() => onChest(chest.id)}
            className={`${styles.chestOption} ${styles[`chest_${chest.accent}`]} ${chest.id === 'magical' && state.meterProgress === 0 ? styles.nextAction : ''}`}
          >
            <span className={styles.chestProgressBadge}><b>+{chest.bountyProgress}</b><small>Bounty<br />progress</small></span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={chest.image} alt="" />
            <strong>{chest.name}</strong>
            <span className={styles.cardsPerChest}>{chest.cardsPerChest} Cards / Chest</span>
            <span className={styles.chestPrice}><CoinIcon small />{formatCompactCoins(chest.price)}</span>
          </button>
        ))}
      </div>
      <p className={styles.balanceDisclaimer}>Illustrative prototype balance &middot; Existing contents and drop rates stay unchanged.</p>
    </div>
  )
}
