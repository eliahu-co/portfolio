import { BountyMeter } from './BountyMeter'
import { formatNumber } from './demoData'
import type { PurchasePreview } from './demoReducer'
import { ChevronGlyph, CoinIcon, PrimaryButton } from './GamePrimitives'
import styles from './ChestPurchaseDialog.module.css'

const RARITY_ICONS = ['common', 'rare', 'legendary'] as const
const TOTAL_COST_DESCRIPTION_ID = 'chest-purchase-total-cost'

export default function ChestPurchaseDialog({
  preview,
  purchaseError,
  onQuantity,
  onConfirm,
}: {
  preview: PurchasePreview
  purchaseError: string | null
  onQuantity: (quantity: number) => void
  onConfirm: () => void
}) {
  const formattedTotalCost = formatNumber(preview.totalCost)

  return (
    <div className={styles.content}>
      <section className={styles.chanceCard} aria-label={`${preview.chest.name} contents`}>
        <div className={styles.chanceCopy}>
          <span>High chance for</span>
          <div
            aria-label="Common, rare, and legendary Card chances"
            className={styles.rarityIcons}
            role="img"
          >
            {RARITY_ICONS.map((rarity) => (
              <span className={`${styles.rarityIcon} ${styles[rarity]}`} key={rarity}>
                <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
                  <path d="m12 2.5 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9L12 2.5Z" />
                </svg>
              </span>
            ))}
          </div>
        </div>
        <div className={styles.cardCount}>
          <strong>Cards x{preview.chest.cardsPerChest}</strong>
          <span>{preview.totalCards} total Cards</span>
        </div>
      </section>

      <div className={styles.purchaseTray}>
        <div className={styles.quantityControl}>
          <button
            aria-label="Increase quantity"
            className={styles.quantityButton}
            disabled={preview.quantity >= preview.maxAffordable}
            onClick={() => onQuantity(preview.quantity + 1)}
            type="button"
          >
            <span className={`${styles.quantityTriangle} ${styles.increase}`} data-testid="quantity-triangle">
              <ChevronGlyph direction="up" />
            </span>
          </button>
          <div aria-label="Chest quantity" className={styles.quantityValue}>
            <small>Quantity</small>
            <strong>{preview.quantity}</strong>
          </div>
          <button
            aria-label="Decrease quantity"
            className={styles.quantityButton}
            disabled={preview.quantity <= 1}
            onClick={() => onQuantity(preview.quantity - 1)}
            type="button"
          >
            <span className={`${styles.quantityTriangle} ${styles.decrease}`} data-testid="quantity-triangle">
              <ChevronGlyph direction="down" />
            </span>
          </button>
        </div>

        <section aria-label="Purchase projection" className={styles.projection}>
          <div className={styles.meters}>
            <div className={styles.meterCard}>
              <BountyMeter
                label="Current Bounty progress"
                progress={preview.progressBefore}
                threshold={preview.meterThreshold}
                variant="compact"
              />
            </div>
            <div className={`${styles.meterCard} ${styles.projectedMeter}`}>
              <BountyMeter
                label="Projected Bounty progress"
                progress={preview.progressAfter}
                threshold={preview.meterThreshold}
                variant="compact"
              />
            </div>
          </div>

          <dl className={styles.quoteSummary}>
            <div>
              <dt>Bounty gain</dt>
              <dd className={styles.progressGain}>+{preview.progressGain}</dd>
            </div>
          </dl>
        </section>
      </div>

      <p className={styles.affordability}>Up to {preview.maxAffordable} Chests affordable</p>
      {purchaseError ? <p className={styles.error} role="alert">{purchaseError}</p> : null}
      <span className={styles.srOnly} id={TOTAL_COST_DESCRIPTION_ID}>
        Total Coin cost: {formattedTotalCost} Coins
      </span>
      <PrimaryButton
        aria-describedby={TOTAL_COST_DESCRIPTION_ID}
        aria-label="Confirm Chest purchase"
        className={styles.confirmButton}
        disabled={!preview.isAffordable}
        onClick={onConfirm}
        type="button"
      >
        <span>Confirm purchase</span>
        <span className={styles.confirmPrice}><CoinIcon small />{formattedTotalCost}</span>
      </PrimaryButton>
    </div>
  )
}
