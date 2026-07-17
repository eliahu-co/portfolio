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
type DetailGroup = 'Supporting metrics' | 'Guardrails'

export function ValidationTable({ slideKey }: { slideKey: DeckSlideKey }) {
  const [hovered, setHovered] = useState<ActiveMetric>(null)
  const [focused, setFocused] = useState<ActiveMetric>(null)
  const [detailGroup, setDetailGroup] = useState<DetailGroup>('Supporting metrics')
  const active = focused ?? hovered
  const reset = useCallback(() => {
    setHovered(null)
    setFocused(null)
    setDetailGroup('Supporting metrics')
  }, [])
  useDeckReset(reset, slideKey)

  const primary = METRIC_GROUPS.find(({ title }) => title === 'Primary metric')!.metrics[0]
  const selectedGroup = METRIC_GROUPS.find(({ title }) => title === detailGroup)!

  const selectGroup = (group: DetailGroup) => {
    setDetailGroup(group)
    setHovered(null)
    setFocused(null)
  }

  return (
    <div className="mt-3">
      <table data-primary-metric="true" className="w-full table-fixed border-collapse text-left">
        <colgroup><col className="w-[48%]" /><col className="w-[24%]" /><col /></colgroup>
        <tbody>
          <tr className="bg-[linear-gradient(90deg,rgba(245,168,0,0.10),rgba(245,168,0,0.26),rgba(245,168,0,0.10))]">
            <td className="py-3 font-serif text-[22px] font-black text-cm-violet-deep">{primary.metric}</td>
            <td className="py-3 font-sans text-[15px] font-medium text-charcoal">Primary decision metric</td>
            <td className="py-3 text-right font-serif text-[24px] font-black text-cm-crimson">
              {primary.mutedTarget} {primary.target}
            </td>
          </tr>
        </tbody>
      </table>

      <div role="tablist" aria-label="Metric groups" className="mt-5 flex gap-8 border-b border-charcoal/20">
        {(['Supporting metrics', 'Guardrails'] as const).map((group) => {
          const selected = detailGroup === group
          return (
            <button
              key={group}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="metric-group-panel"
              data-deck-interactive="true"
              className={`border-b-2 pb-2 font-sans text-[12px] font-medium uppercase tracking-[0.12em] transition-colors duration-300 motion-reduce:transition-none focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#1E7BA8] ${selected ? 'border-cm-crimson text-cm-violet-deep' : 'border-transparent text-charcoal/55 hover:text-cm-violet-deep'}`}
              onClick={() => selectGroup(group)}
            >
              {group}
            </button>
          )
        })}
      </div>

      <div id="metric-group-panel" role="tabpanel" className="min-h-[258px]">
        <table className="w-full table-fixed border-collapse text-left">
          <colgroup><col className="w-[48%]" /><col className="w-[24%]" /><col /></colgroup>
          <thead>
            <tr className="border-b border-charcoal/20 font-sans text-[11px] font-medium uppercase tracking-[0.1em] text-charcoal/55">
              <th className="py-2">Metric</th>
              <th className="py-2">Role</th>
              <th className="py-2 text-right">Target</th>
            </tr>
          </thead>
          <tbody>
            {selectedGroup.metrics.map((metric) => {
              const selected = active?.metric === metric.metric
              const selection = { metric: metric.metric, help: metric.metricHelp }
              return (
                <tr
                  key={metric.metric}
                  data-metric-row={metric.metric}
                  data-active-row={selected ? 'true' : 'false'}
                  className={`h-10 border-b border-charcoal/15 transition-opacity duration-300 motion-reduce:transition-none ${active && !selected ? 'opacity-20' : 'opacity-100'}`}
                >
                  <td className="pr-4">
                    <button
                      type="button"
                      data-deck-interactive="true"
                      aria-expanded={selected}
                      onMouseEnter={() => setHovered(selection)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setFocused(selection)}
                      onBlur={() => setFocused(null)}
                      className={`min-h-10 w-full border-0 bg-transparent text-left font-sans text-[15px] font-medium text-cm-violet-deep ${selected ? 'font-extrabold' : ''}`}
                    >
                      {metric.metric}
                    </button>
                  </td>
                  <td className="px-2">{metric.role && <span className={`inline-flex w-[116px] justify-center rounded-full border px-2 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.08em] ${ROLE_CLASSES[metric.role]}`}>{metric.role}</span>}</td>
                  <td className="pl-4 text-right font-sans text-[14px] text-charcoal">{metric.mutedTarget && <><span className="text-charcoal/55">{metric.mutedTarget}</span>{' '}</>}<span className="font-bold">{metric.target}</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div
        role="status"
        aria-label="Metric detail"
        data-active={active ? 'true' : 'false'}
        className={`mt-2 min-h-[54px] border-t border-charcoal/20 pt-3 font-sans text-[13px] leading-relaxed ${active ? 'font-bold text-cm-violet-deep' : 'text-charcoal'}`}
      >
        {active ? (
          <><span>{active.metric} — </span>{active.help ? TOOLTIP_NOTES[active.help] : 'Used to explain whether the feature creates incremental value without damaging the core economy.'}</>
        ) : TOOLTIP_NOTES['test-methodology']}
      </div>
    </div>
  )
}
