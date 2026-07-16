'use client'

import { createPortal } from 'react-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ADDITIONAL_TESTS,
  METRIC_GROUPS,
  PROTOCOL,
  TOOLTIP_LABELS,
  TOOLTIP_NOTES,
  type MetricRole,
  type TooltipKey,
} from '../content/validation'
import Section, { Eyebrow } from './Section'

const ROLE_CLASSES: Record<MetricRole, string> = {
  Monetization: 'border-cm-wood/30 bg-cm-gold/10 text-cm-wood/80',
  Economy: 'border-[#0F3D54]/25 bg-cm-sky/10 text-[#0F3D54]/80',
  'Feature funnel': 'border-cm-violet-deep/20 bg-cm-violet-deep/5 text-cm-violet-deep/80',
}

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

function InfoButton({
  tooltip,
  onShow,
  onHide,
}: {
  tooltip: TooltipKey
  onShow: (tooltip: TooltipKey, anchor: HTMLButtonElement) => void
  onHide: () => void
}) {
  return (
    <button
      type="button"
      aria-label={TOOLTIP_LABELS[tooltip]}
      aria-describedby={`${tooltip}-tooltip`}
      onMouseEnter={(event) => onShow(tooltip, event.currentTarget)}
      onMouseLeave={onHide}
      onFocus={(event) => onShow(tooltip, event.currentTarget)}
      onBlur={onHide}
      onClick={(event) => onShow(tooltip, event.currentTarget)}
      className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-cm-wood/60 bg-cm-cream font-sans text-[8px] font-bold normal-case tracking-normal text-cm-wood outline-none transition-colors hover:border-cm-crimson hover:text-cm-crimson focus-visible:ring-2 focus-visible:ring-cm-gold focus-visible:ring-offset-1"
    >
      i
    </button>
  )
}

export default function FeatureValidation() {
  const [mounted, setMounted] = useState(false)
  const [activeTooltip, setActiveTooltip] = useState<TooltipKey | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const activeInfoButtonRef = useRef<HTMLButtonElement | null>(null)
  const [population, control, treatment, hypothesis] = PROTOCOL

  const positionTooltip = useCallback((button?: HTMLButtonElement | null) => {
    const anchor = button ?? activeInfoButtonRef.current
    if (!anchor) return

    const rect = anchor.getBoundingClientRect()
    const maxLeft = Math.max(VIEWPORT_GUTTER, window.innerWidth - TOOLTIP_WIDTH - VIEWPORT_GUTTER)
    setTooltipPosition({
      top: rect.bottom + 8,
      left: Math.min(Math.max(rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2, VIEWPORT_GUTTER), maxLeft),
    })
  }, [])

  const showTooltip = useCallback((tooltip: TooltipKey, anchor: HTMLButtonElement) => {
    activeInfoButtonRef.current = anchor
    positionTooltip(anchor)
    setActiveTooltip(tooltip)
  }, [positionTooltip])

  const hideTooltip = useCallback(() => {
    setActiveTooltip(null)
    activeInfoButtonRef.current = null
  }, [])

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!activeTooltip) return
    const reposition = () => positionTooltip()
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)
    return () => {
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
    }
  }, [activeTooltip, positionTooltip])

  return (
    <>
      <Section
        id="validation"
        eyebrow={(
          <span className="inline-flex items-center gap-1.5">
            <span>A/B Test</span>
            <InfoButton tooltip="test-methodology" onShow={showTooltip} onHide={hideTooltip} />
          </span>
        )}
        title="Card Bounty: Feature Validation"
      >
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
          <table className="w-full min-w-[640px] table-fixed border-collapse text-left md:min-w-[720px]">
            <colgroup>
              <col className="w-[28%] md:w-[32%]" />
              <col className="w-[104px] md:w-[132px]" />
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
                      <th scope="col" className="pb-1 pl-2 pt-3 text-left align-bottom font-sans text-[9px] font-normal uppercase tracking-[0.12em] text-charcoal/70 md:pl-7">
                        <span className="inline-flex items-center gap-1.5">
                          <span>Proposed target</span>
                        </span>
                      </th>
                    )}
                  </tr>
                  {group.metrics.map(({ metric, role, target, mutedTarget, metricHelp }) => {
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
                        <td data-metric-name className="py-3 pr-4 align-top font-sans text-[13px] font-medium leading-relaxed text-cm-violet-deep">
                          <span
                            data-metric-help={metricHelp ? true : undefined}
                            className={metricHelp
                              ? 'grid w-full grid-cols-[minmax(0,1fr)_14px] items-center gap-2'
                              : 'inline-flex items-center gap-1.5'}
                          >
                            <span data-metric-label>{metric}</span>
                            {metricHelp && (
                              <span className="justify-self-end">
                                <InfoButton tooltip={metricHelp} onShow={showTooltip} onHide={hideTooltip} />
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="px-1.5 py-3 align-top md:px-3">
                          {role && (
                            <span className="inline-flex items-center gap-1.5">
                              <span data-metric-role className={`inline-flex w-[92px] justify-center whitespace-nowrap rounded-full border px-2 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.08em] md:w-28 ${ROLE_CLASSES[role]}`}>
                                {role}
                              </span>
                            </span>
                          )}
                        </td>
                        <td data-metric-target className={`py-3 pl-2 align-top font-sans text-[13px] leading-relaxed text-charcoal md:pl-7 ${isNorthStar ? 'font-medium' : ''}`}>
                          <span>{target}</span>
                          {mutedTarget && <>{' '}<span data-muted-target className="text-charcoal/45">{mutedTarget}</span></>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              )
            })}
          </table>
        </div>

        <div data-additional-tests className="max-w-2xl">
          <Eyebrow>Additional Tests</Eyebrow>
          <ul className="flex flex-col gap-5">
            {ADDITIONAL_TESTS.map((test) => (
              <li key={test.title} className="flex items-start gap-3">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 h-4 w-4 shrink-0 text-cm-gold"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>
                <div>
                  <h3 className="font-sans text-[14px] font-normal leading-relaxed text-cm-violet-deep">{test.title}</h3>
                  <p className="font-sans text-[14px] leading-relaxed text-charcoal">{test.setup}</p>
                  <p className="mt-1 font-sans text-[14px] leading-relaxed text-charcoal/70">{test.outcome}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {mounted && createPortal(
        <>
          {(Object.keys(TOOLTIP_NOTES) as TooltipKey[]).map((tooltip) => (
            <div
              key={tooltip}
              id={`${tooltip}-tooltip`}
              role="tooltip"
              aria-hidden={activeTooltip !== tooltip}
              style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
              className={`pointer-events-none fixed z-[100] w-[min(18rem,calc(100vw-2rem))] rounded-lg border border-cm-wood/35 bg-cm-cream p-3 text-left font-sans text-[11px] font-normal normal-case leading-relaxed tracking-normal text-charcoal/80 shadow-[0_10px_24px_rgba(42,27,84,0.18)] transition-[opacity,visibility] duration-150 ${activeTooltip === tooltip ? 'visible opacity-100' : 'invisible opacity-0'}`}
            >
              {TOOLTIP_NOTES[tooltip]}
            </div>
          ))}
        </>,
        document.body
      )}
    </>
  )
}
