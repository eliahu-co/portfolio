import type { DemoCollection } from './demoVisualData'
import styles from './CardsCenterScreen.module.css'

const ribbonToneClass: Record<DemoCollection['ribbonTone'], string> = {
  red: styles.ribbonRed,
  violet: styles.ribbonViolet,
  blue: styles.ribbonBlue,
  green: styles.ribbonGreen,
}

export default function CollectionMedallion({
  collection,
}: {
  collection: DemoCollection
}) {
  return (
    <li
      className={styles.medallion}
      aria-label={`${collection.name}, ${collection.progress} of 9 Cards, reward ${collection.rewardLabel}`}
    >
      <div className={styles.portrait}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={collection.image} alt="" />
      </div>
      <div className={`${styles.ribbon} ${ribbonToneClass[collection.ribbonTone]}`}>
        <strong>{collection.name}</strong>
      </div>
      <span className={styles.progressCapsule} aria-hidden="true">
        {collection.progress}/9
      </span>
      <span className={styles.rewardLabel}>{collection.rewardLabel}</span>
    </li>
  )
}
