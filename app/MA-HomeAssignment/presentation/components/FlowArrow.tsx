import type { SVGProps } from 'react'

type FlowArrowProps = SVGProps<SVGSVGElement> & {
  readonly direction?: 'right' | 'left' | 'down' | 'up'
  readonly color?: string
}

const PATHS = {
  right: ['M1 7 H19', 'M14 2 L19 7 L14 12'],
  left: ['M19 7 H1', 'M6 2 L1 7 L6 12'],
  down: ['M7 1 V19', 'M2 14 L7 19 L12 14'],
  up: ['M7 19 V1', 'M2 6 L7 1 L12 6'],
} as const

export function FlowArrow({ direction = 'right', color = 'currentColor', className, ...props }: FlowArrowProps) {
  const vertical = direction === 'up' || direction === 'down'
  const [line, chevron] = PATHS[direction]

  return (
    <svg {...props} data-flow-arrow="true" className={className} viewBox={vertical ? '0 0 14 20' : '0 0 20 14'} fill="none" aria-hidden="true">
      <path d={line} stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <path d={chevron} stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
