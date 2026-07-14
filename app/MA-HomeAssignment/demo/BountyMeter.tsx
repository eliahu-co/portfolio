import styles from './BountyMeter.module.css'

export type BountyMeterProps = {
  label: string
  progress: number
  threshold: number
  targetImage?: string
  variant?: 'standard' | 'compact'
}

const MILESTONE_PERCENTAGES = Array.from({ length: 9 }, (_, index) => (index + 1) * 10)

export function BountyMeter({
  label,
  progress,
  threshold,
  targetImage,
  variant = 'standard',
}: BountyMeterProps) {
  const clampedProgress =
    threshold > 0 ? Math.min(threshold, Math.max(0, progress)) : 0
  const fillPercentage =
    threshold > 0 ? (clampedProgress / threshold) * 100 : 0

  return (
    <div className={`${styles.meter} ${styles[variant]}`}>
      <div className={styles.summary}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>
          {clampedProgress} / {threshold}
        </span>
      </div>
      <div
        aria-label={label}
        aria-valuemax={threshold}
        aria-valuemin={0}
        aria-valuenow={clampedProgress}
        aria-valuetext={`${clampedProgress} of ${threshold} ${label}`}
        className={styles.progressbar}
        role="progressbar"
      >
        <div className={styles.rail}>
          <div
            className={styles.fill}
            data-testid="bounty-meter-fill"
            style={{ width: `${fillPercentage}%` }}
          />
          {MILESTONE_PERCENTAGES.map((percentage) => (
            <span
              aria-hidden="true"
              className={styles.milestone}
              data-testid="bounty-milestone"
              key={percentage}
              style={{ left: `${percentage}%` }}
            />
          ))}
        </div>
        <div aria-hidden="true" className={styles.endpoint}>
          {targetImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="" className={styles.targetImage} src={targetImage} />
          ) : null}
          <span>{threshold}</span>
        </div>
      </div>
    </div>
  )
}
