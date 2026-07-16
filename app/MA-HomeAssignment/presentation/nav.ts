const INTERACTIVE_SELECTOR = [
  'button',
  'a[href]',
  'input',
  'textarea',
  'select',
  'summary',
  '[contenteditable]:not([contenteditable="false"])',
  '[data-deck-interactive]',
].join(', ')

export function clampIndex(index: number, registryLength: number): number {
  if (!Number.isFinite(index) || !Number.isFinite(registryLength) || registryLength <= 0) return 0
  const lastIndex = Math.max(0, Math.floor(registryLength) - 1)
  return Math.min(Math.max(0, Math.floor(index)), lastIndex)
}

export function stepIndex(
  current: number,
  direction: 1 | -1,
  registryLength: number,
): number {
  return clampIndex(current + direction, registryLength)
}

export function hashForIndex(index: number): string {
  const safeIndex = Number.isInteger(index) && index >= 0 ? index : 0
  return `#slide-${safeIndex + 1}`
}

export function indexFromHash(hash: string, registryLength: number): number {
  if (!Number.isInteger(registryLength) || registryLength <= 0) return 0
  const match = /^#slide-([1-9]\d*)$/.exec(hash)
  if (!match) return 0

  const slideNumber = Number(match[1])
  if (!Number.isSafeInteger(slideNumber) || slideNumber > registryLength) return 0
  return slideNumber - 1
}

export function isDeckInteractiveTarget(target: EventTarget | null): boolean {
  if (typeof Element === 'undefined' || typeof Node === 'undefined') return false

  const element = target instanceof Element
    ? target
    : target instanceof Node
      ? target.parentElement
      : null

  return element?.closest(INTERACTIVE_SELECTOR) !== null && element !== null
}
