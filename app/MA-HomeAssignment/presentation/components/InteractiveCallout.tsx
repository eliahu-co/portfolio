'use client'

import { useCallback, useState, type ReactNode } from 'react'
import { PrintDetails, RevealControl } from '../primitives'
import { useDeckReset, type DeckSlideKey } from '../useDeckReset'

export type InteractiveCalloutProps = {
  readonly id: string
  readonly label: ReactNode
  readonly detail: ReactNode
  readonly slideKey: DeckSlideKey
  readonly className?: string
  readonly buttonClassName?: string
}

type InteractionState = {
  hovered: boolean
  focused: boolean
  pinned: boolean
}

const IDLE: InteractionState = {
  hovered: false,
  focused: false,
  pinned: false,
}

export function InteractiveCallout({
  id,
  label,
  detail,
  slideKey,
  className = '',
  buttonClassName = '',
}: InteractiveCalloutProps) {
  const [interaction, setInteraction] = useState<InteractionState>(IDLE)
  const reset = useCallback(() => setInteraction(IDLE), [])
  const active = interaction.hovered || interaction.focused || interaction.pinned

  useDeckReset(reset, slideKey)

  return (
    <div
      data-interactive-callout="true"
      data-active={active ? 'true' : 'false'}
      className={className}
    >
      <RevealControl
        summary={label}
        active={active}
        aria-controls={id}
        className={buttonClassName}
        onMouseEnter={() => setInteraction((current) => ({ ...current, hovered: true }))}
        onMouseLeave={() => setInteraction((current) => ({ ...current, hovered: false }))}
        onFocus={() => setInteraction((current) => ({ ...current, focused: true }))}
        onBlur={() => setInteraction((current) => ({ ...current, focused: false }))}
        onClick={() => setInteraction((current) => ({ ...current, pinned: !current.pinned }))}
        onKeyDown={(event) => {
          if (event.key !== 'Escape' || !active) return
          event.preventDefault()
          event.stopPropagation()
          reset()
        }}
      />

      {active && (
        <div
          id={id}
          role="status"
          data-callout-detail="true"
          className="mt-3 rounded-xl border border-[#1E7BA8]/40 bg-[#1E7BA8]/10 px-4 py-3 font-sans text-[14px] leading-relaxed text-[#1A1A1A]"
        >
          {detail}
        </div>
      )}

      <PrintDetails>{detail}</PrintDetails>
    </div>
  )
}
