import { TARGETS, formatCountdown, type TargetId } from './demoData'
import { ChevronGlyph, StarRow } from './GamePrimitives'
import styles from './BountyPanels.module.css'
import guided from './GuidedAction.module.css'

export default function TargetPicker({
  countdown,
  onSelect,
}: {
  countdown: number
  onSelect: (targetId: TargetId) => void
}) {
  return (
    <div className={styles.targetPicker}>
      <div className={styles.pickerInfo}>
        <div>
          <strong>Select one eligible missing regular Card.</strong>
          <span>Gold, Diamond &amp; Seasonal Cards are excluded.</span>
        </div>
        <time>{formatCountdown(countdown)}</time>
      </div>
      <div className={styles.targetList}>
        {TARGETS.map((target, index) => (
          <section key={target.id} className={styles.targetCollection}>
            <header>
              <div><h3>{target.collection}</h3><span>{target.collectionProgress}/9 Cards</span></div>
              {index === 0 && <small>Closest to complete</small>}
            </header>
            <button
              type="button"
              onClick={() => onSelect(target.id)}
              aria-label={`Select ${target.name}, ${target.collection} ${target.collectionProgress} of 9 Cards, ${target.stars} Stars, regular tradable`}
              className={`${styles.targetChoice} ${target.id === 'whale-boat' ? `${styles.targetChoiceRecommended} ${guided.attention}` : ''}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={target.image} alt="" />
              <span className={styles.targetChoiceText}>
                {target.id === 'whale-boat' && <small>Walkthrough pick</small>}
                <strong>{target.name}</strong>
                <StarRow count={target.stars} compact />
                <span>Regular &middot; Tradable</span>
              </span>
              <span className={styles.targetSelectArrow}><ChevronGlyph direction="right" /></span>
            </button>
          </section>
        ))}
      </div>
    </div>
  )
}
