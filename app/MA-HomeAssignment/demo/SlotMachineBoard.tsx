import type { ReelSymbol } from './demoVisualData'
import styles from './SlotMachineBoard.module.css'

export function SlotMachineBoard({
  symbols,
  spinCycle,
}: {
  symbols: readonly ReelSymbol[]
  spinCycle: number
}) {
  return (
    <section className={styles.board} aria-label="Slot machine reels">
      <img
        className={styles.cabinetArt}
        src="/coinmaster/card-bounty/generated/spin/slot-cabinet.webp"
        alt=""
        aria-hidden="true"
        draggable={false}
      />
      <div key={spinCycle} className={styles.reelGrid}>
        {symbols.map((symbol, index) => {
          const row = Math.floor(index / 3) + 1
          const reel = (index % 3) + 1

          return (
            <span className={styles.reelCell} key={`${symbol.id}-${index}`}>
              <img
                className={styles.symbol}
                src={symbol.image}
                alt={`${symbol.label} symbol, row ${row}, reel ${reel}`}
                draggable={false}
              />
            </span>
          )
        })}
      </div>
    </section>
  )
}
