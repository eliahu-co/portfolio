import CollectionMedallion from './CollectionMedallion'
import { formatCountdown } from './demoData'
import { DEMO_COLLECTIONS } from './demoVisualData'
import { CardBack } from './GamePrimitives'
import styles from './CardsCenterScreen.module.css'

export default function CardsCenterScreen({
  countdown,
  onOpenBounty,
}: {
  countdown: number
  onOpenBounty: () => void
}) {
  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <span className={styles.info} aria-hidden="true">i</span>
        <h1>Cards Center</h1>
        <a href="/MA-HomeAssignment#prototype" aria-label="Close Cards Center">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" /></svg>
        </a>
      </header>

      <div className={styles.scrollBody}>
        <button
          type="button"
          className={styles.bountyButton}
          aria-label="Open Card Bounty"
          onClick={onOpenBounty}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/coinmaster/card-bounty/generated/card-bounty-badge.webp" alt="" />
          <time>{formatCountdown(countdown)}</time>
        </button>

        <ul className={styles.collectionList} aria-label="Card collections">
          {DEMO_COLLECTIONS.map((collection) => (
            <CollectionMedallion key={collection.id} collection={collection} />
          ))}
        </ul>
      </div>

      <nav className={styles.tabs} aria-label="Cards Center views">
        <span className={styles.activeTab} aria-current="page">
          <CardBack className={styles.tabCard} />
          <b>Sets</b>
        </span>
        <span>
          <CardBack className={styles.tabCard} />
          <b>Albums</b>
        </span>
      </nav>
    </div>
  )
}
