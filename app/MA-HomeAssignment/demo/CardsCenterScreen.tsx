import CollectionMedallion from './CollectionMedallion'
import { formatCountdown } from './demoData'
import { DEMO_COLLECTIONS } from './demoVisualData'
import { CardBack } from './GamePrimitives'
import styles from './CardsCenterScreen.module.css'

export default function CardsCenterScreen({
  countdown,
  eventCompleted = false,
  completedCollection,
  onOpenBounty,
}: {
  countdown: number
  eventCompleted?: boolean
  completedCollection?: string
  onOpenBounty: () => void
}) {
  const collections = DEMO_COLLECTIONS.map((collection) => {
    if (!eventCompleted || collection.name !== completedCollection) return collection
    const progress = Math.min(9, collection.progress + 1)
    return {
      ...collection,
      progress,
      rewardLabel: progress === 9 ? 'Complete' : collection.rewardLabel,
    }
  })

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <span className={styles.info} aria-hidden="true">i</span>
        <h1 data-cards-center-heading tabIndex={-1}>Cards Center</h1>
        <span className={styles.closeDisplay} aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="m7 7 10 10M17 7 7 17" /></svg>
        </span>
      </header>

      <div className={styles.scrollBody}>
        <button
          type="button"
          className={`${styles.bountyButton} ${eventCompleted ? styles.bountyButtonCompleted : ''}`}
          aria-label={eventCompleted ? 'Card Bounty completed' : 'Open Card Bounty'}
          disabled={eventCompleted}
          onClick={onOpenBounty}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/coinmaster/card-bounty/generated/card-bounty-badge.webp" alt="" />
          <time>{eventCompleted ? 'Complete' : formatCountdown(countdown)}</time>
        </button>

        <ul className={styles.collectionList} aria-label="Card collections">
          {collections.map((collection) => (
            <CollectionMedallion key={collection.id} collection={collection} />
          ))}
        </ul>
      </div>

      <nav className={styles.tabs} aria-label="Cards Center views">
        <span className={styles.activeTab} aria-current="page">
          <CardBack className={styles.tabCard} />
          <b className={styles.tabLabel}>Sets</b>
        </span>
        <span>
          <CardBack className={styles.tabCard} />
          <b className={styles.tabLabel}>Albums</b>
        </span>
      </nav>
    </div>
  )
}
