'use client'

import { createPortal } from 'react-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import Section from './Section'

const PROTOCOL = [
  {
    label: 'Population',
    body: 'Players with the Cards Center unlocked and at least one eligible missing Card.',
  },
  {
    label: 'Control',
    body: 'Existing Cards Center.',
  },
  {
    label: 'Treatment',
    body: 'Existing Cards Center with Card Bounty as a time-limited LiveOps event.',
  },
  {
    label: 'Hypothesis',
    body: 'A visible meter that advances with each Chest purchased and guarantees a chosen missing Card will increase Coin consumption, driving demand for existing Spin and Coin offers and lifting ARPDAU.',
  },
]

type MetricRole = 'Monetization' | 'Economy' | 'Feature funnel'
type ValidationMetric = {
  metric: string
  target: string
  role?: MetricRole
  funnelHelp?: boolean
}
type ValidationGroup = {
  title: 'Primary metric' | 'Supporting metrics' | 'Guardrails'
  metrics: ValidationMetric[]
  emphasis?: 'north-star'
}

const METRIC_GROUPS: ValidationGroup[] = [
  {
    title: 'Primary metric',
    emphasis: 'north-star',
    metrics: [{ metric: 'ARPDAU', target: '≥5% lift' }],
  },
  {
    title: 'Supporting metrics',
    metrics: [
      {
        metric: 'ARPPU by payer tier',
        role: 'Monetization',
        target: '≥5% lift overall and ≥8% among the high-spender cohort',
      },
      { metric: 'Coin spend on Chests per DAU', role: 'Economy', target: '≥10% lift' },
      { metric: 'Total Coin Consumption per DAU', role: 'Economy', target: '≥5% lift' },
      {
        metric: 'Target Selection Rate',
        role: 'Feature funnel',
        target: '≥30% of eligible DAU',
        funnelHelp: true,
      },
      {
        metric: 'First-Chest Conversion',
        role: 'Feature funnel',
        target: '≥65% of players who select a target',
      },
      {
        metric: 'Bounty Completion Rate',
        role: 'Feature funnel',
        target: '10–20% of activated players',
      },
    ],
  },
  {
    title: 'Guardrails',
    metrics: [
      { metric: 'Card Collections Completed per Player', target: '≤115%' },
      { metric: 'Village Upgrades per Player', target: '≥95%' },
      { metric: 'Post-Event Coin Spend on Chests per Player', target: '≥95%' },
      { metric: 'Post-Event Revenue per Player', target: '≥98%' },
    ],
  },
]

const ROLE_CLASSES: Record<MetricRole, string> = {
  Monetization: 'border-cm-wood/30 bg-cm-gold/10 text-cm-wood/80',
  Economy: 'border-[#0F3D54]/25 bg-cm-sky/10 text-[#0F3D54]/80',
  'Feature funnel': 'border-cm-violet-deep/20 bg-cm-violet-deep/5 text-cm-violet-deep/80',
}

const FUNNEL_NOTE = 'The funnel is coherent: 30% × 65% ≈ 20% activation. The completion range ensures the guarantee provides value without becoming too easy.'
const TOOLTIP_WIDTH = 288
const VIEWPORT_GUTTER = 16

function ProtocolItem({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p className="mb-1 font-sans text-[10px] font-extrabold uppercase tracking-[0.14em] text-black">{label}</p>
      <p className="font-sans text-[14px] leading-relaxed text-charcoal">{body}</p>
    </div>
  )
}

export default function FeatureValidation() {
  const [mounted, setMounted] = useState(false)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const infoButtonRef = useRef<HTMLButtonElement | null>(null)
  const [population, control, treatment, hypothesis] = PROTOCOL

  const positionTooltip = useCallback(() => {
    const anchor = infoButtonRef.current
    if (!anchor) return

    const rect = anchor.getBoundingClientRect()
    const maxLeft = Math.max(VIEWPORT_GUTTER, window.innerWidth - TOOLTIP_WIDTH - VIEWPORT_GUTTER)
    setTooltipPosition({
      top: rect.bottom + 8,
      left: Math.min(Math.max(rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2, VIEWPORT_GUTTER), maxLeft),
    })
  }, [])

  const showTooltip = useCallback(() => {
    positionTooltip()
    setTooltipVisible(true)
  }, [positionTooltip])

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!tooltipVisible) return
    const reposition = () => positionTooltip()
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)
    return () => {
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
    }
  }, [positionTooltip, tooltipVisible])

  return (
    <>
      <Section id="validation" eyebrow="A/B Test" title="Feature Validation">
        <div className="mb-8 max-w-2xl space-y-5">
          <ProtocolItem {...population} />
          <div
            data-protocol-comparison
            className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-x-4 md:grid-cols-[160px_minmax(0,1fr)] md:gap-x-6"
          >
            <ProtocolItem {...control} />
            <ProtocolItem {...treatment} />
          </div>
          <ProtocolItem {...hypothesis} />
        </div>

        <div className="mb-10 max-w-3xl overflow-x-auto">
          <table className="w-full min-w-[720px] table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[30%]" />
              <col className="w-[132px]" />
              <col />
            </colgroup>
            {METRIC_GROUPS.map((group) => {
              const isNorthStar = group.emphasis === 'north-star'

              return (
                <tbody key={group.title} data-metric-group={group.title}>
                  <tr className={`border-b-2 ${isNorthStar ? 'border-cm-wood' : 'border-charcoal/25'}`}>
                    <th colSpan={isNorthStar ? 2 : 3} scope="rowgroup" className={`text-left ${isNorthStar ? 'pb-1 pt-3' : 'pb-2 pt-6'}`}>
                      <h3 className="inline-flex items-center font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-cm-violet-deep">
                        <span>{group.title}</span>
                      </h3>
                    </th>
                    {isNorthStar && (
                      <th scope="col" className="pb-1 pl-7 pt-3 text-left align-bottom font-sans text-[9px] font-normal uppercase tracking-[0.12em] text-charcoal/70">
                        Proposed target
                      </th>
                    )}
                  </tr>
                  {group.metrics.map(({ metric, role, target, funnelHelp }) => {
                    const isNorthStarMetric = isNorthStar && metric === 'ARPDAU'

                    return (
                      <tr
                        key={metric}
                        data-metric-row
                        className={`border-b border-charcoal/15 last:border-b-0 ${isNorthStarMetric ? 'animate-shimmer motion-reduce:animate-none' : ''}`}
                        style={isNorthStarMetric ? {
                          backgroundImage: 'linear-gradient(90deg, rgba(245,168,0,0.08) 0%, rgba(245,168,0,0.28) 50%, rgba(245,168,0,0.08) 100%)',
                          backgroundSize: '200% 100%',
                        } : undefined}
                      >
                        <td data-metric-name className="py-3 pr-4 align-top font-sans text-[13px] font-medium leading-relaxed text-cm-violet-deep">{metric}</td>
                        <td className="px-3 py-3 align-top">
                          {role && (
                            <span
                              className="inline-flex items-center gap-1.5"
                              onMouseEnter={funnelHelp ? showTooltip : undefined}
                              onMouseLeave={funnelHelp ? () => setTooltipVisible(false) : undefined}
                            >
                              <span data-metric-role className={`inline-flex w-28 justify-center whitespace-nowrap rounded-full border px-2 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.08em] ${ROLE_CLASSES[role]}`}>
                                {role}
                              </span>
                              {funnelHelp && (
                                <button
                                  ref={infoButtonRef}
                                  type="button"
                                  aria-label="About Feature funnel"
                                  aria-describedby="feature-funnel-tooltip"
                                  onFocus={showTooltip}
                                  onBlur={() => setTooltipVisible(false)}
                                  onClick={showTooltip}
                                  className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-cm-wood/60 bg-cm-cream font-sans text-[8px] font-bold normal-case tracking-normal text-cm-wood outline-none transition-colors hover:border-cm-crimson hover:text-cm-crimson focus-visible:ring-2 focus-visible:ring-cm-gold focus-visible:ring-offset-1"
                                >
                                  i
                                </button>
                              )}
                            </span>
                          )}
                        </td>
                        <td data-metric-target className={`py-3 pl-7 align-top font-sans text-[13px] leading-relaxed text-charcoal ${isNorthStar ? 'font-medium' : ''}`}>{target}</td>
                      </tr>
                    )
                  })}
                </tbody>
              )
            })}
          </table>
        </div>
      </Section>

      {mounted && createPortal(
        <div
          id="feature-funnel-tooltip"
          role="tooltip"
          aria-hidden={!tooltipVisible}
          style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
          className={`pointer-events-none fixed z-[100] w-[min(18rem,calc(100vw-2rem))] rounded-lg border border-cm-wood/35 bg-cm-cream p-3 text-left font-sans text-[11px] font-normal normal-case leading-relaxed tracking-normal text-charcoal/80 shadow-[0_10px_24px_rgba(42,27,84,0.18)] transition-[opacity,visibility] duration-150 ${tooltipVisible ? 'visible opacity-100' : 'invisible opacity-0'}`}
        >
          {FUNNEL_NOTE}
        </div>,
        document.body
      )}
    </>
  )
}
