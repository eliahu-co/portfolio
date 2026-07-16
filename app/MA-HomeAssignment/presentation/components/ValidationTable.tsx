'use client'

import { useCallback, useState } from 'react'
import { METRIC_GROUPS, TOOLTIP_NOTES, type MetricRole } from '@/app/MA-HomeAssignment/content/validation'
import { useDeckReset, type DeckSlideKey } from '../useDeckReset'

const ROLE_CLASSES: Record<MetricRole, string> = {
  Monetization: 'border-cm-wood/30 bg-cm-gold/10 text-cm-wood/80',
  Economy: 'border-[#0F3D54]/25 bg-cm-sky/10 text-[#0F3D54]/80',
  'Feature funnel': 'border-cm-violet-deep/20 bg-cm-violet-deep/5 text-cm-violet-deep/80',
}

type ActiveMetric = { metric: string; help?: keyof typeof TOOLTIP_NOTES } | null

export function ValidationTable({ slideKey }: { slideKey: DeckSlideKey }) {
  const [active, setActive] = useState<ActiveMetric>(null)
  const reset = useCallback(() => setActive(null), [])
  useDeckReset(reset, slideKey)

  return (
    <div>
      <table className="w-full table-fixed border-collapse text-left">
        <colgroup><col className="w-[40%]" /><col className="w-[20%]" /><col /></colgroup>
        {METRIC_GROUPS.map((group) => (
          <tbody key={group.title}>
            <tr className="border-b-2 border-cm-wood/55">
              <th colSpan={3} className="pb-0.5 pt-1 font-sans text-[10px] font-extrabold uppercase tracking-[0.11em] text-cm-violet-deep">{group.title}</th>
            </tr>
            {group.metrics.map((metric) => {
              const selected = active?.metric === metric.metric
              return (
                <tr key={metric.metric} className={`border-b border-charcoal/15 ${group.emphasis ? 'bg-[linear-gradient(90deg,rgba(245,168,0,0.08),rgba(245,168,0,0.24),rgba(245,168,0,0.08))]' : ''}`}>
                  <td className="py-0.5 pr-4">
                    <button
                      type="button"
                      data-deck-interactive="true"
                      aria-expanded={selected}
                      onMouseEnter={() => setActive({ metric: metric.metric, help: metric.metricHelp })}
                      onMouseLeave={() => setActive(null)}
                      onFocus={() => setActive({ metric: metric.metric, help: metric.metricHelp })}
                      onBlur={() => setActive(null)}
                      className={`min-h-7 w-full border-0 bg-transparent text-left font-sans text-[12px] font-medium text-cm-violet-deep ${selected ? 'font-black underline decoration-cm-gold decoration-3 underline-offset-4' : ''}`}
                    >
                      {metric.metric}
                    </button>
                  </td>
                  <td className="px-2 py-0.5">{metric.role && <span className={`inline-flex w-[100px] justify-center rounded-full border px-2 py-0.5 font-sans text-[8px] font-bold uppercase tracking-[0.08em] ${ROLE_CLASSES[metric.role]}`}>{metric.role}</span>}</td>
                  <td className="py-0.5 pl-4 font-sans text-[12px] text-charcoal"><span className="font-bold">{metric.target}</span>{metric.mutedTarget && <span className="ml-1 text-charcoal/55">{metric.mutedTarget}</span>}</td>
                </tr>
              )
            })}
          </tbody>
        ))}
      </table>
      <div className="mt-1 min-h-[34px] border-l-4 border-cm-gold pl-4 font-sans text-[12px] leading-relaxed text-charcoal">
        {active ? (active.help ? TOOLTIP_NOTES[active.help] : `${active.metric} is used to explain whether the feature creates incremental value without damaging the core economy.`) : TOOLTIP_NOTES['test-methodology']}
      </div>
    </div>
  )
}
