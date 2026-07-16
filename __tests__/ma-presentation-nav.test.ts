import {
  clampIndex,
  hashForIndex,
  indexFromHash,
  isDeckInteractiveTarget,
  stepIndex,
} from '@/app/MA-HomeAssignment/presentation/nav'

describe('MA presentation navigation', () => {
  it('clamps against the supplied registry length', () => {
    expect(clampIndex(-1, 3)).toBe(0)
    expect(clampIndex(1, 3)).toBe(1)
    expect(clampIndex(4, 3)).toBe(2)
    expect(clampIndex(4, 8)).toBe(4)
    expect(clampIndex(Number.NaN, 3)).toBe(0)
    expect(clampIndex(1, 0)).toBe(0)
  })

  it('steps in either direction and remains clamped at the registry ends', () => {
    expect(stepIndex(0, 1, 3)).toBe(1)
    expect(stepIndex(1, -1, 3)).toBe(0)
    expect(stepIndex(0, -1, 3)).toBe(0)
    expect(stepIndex(2, 1, 3)).toBe(2)
    expect(stepIndex(2, 1, 6)).toBe(3)
  })

  it('generates one-based slide hashes without a deck total', () => {
    expect(hashForIndex(0)).toBe('#slide-1')
    expect(hashForIndex(20)).toBe('#slide-21')
    expect(hashForIndex(-4)).toBe('#slide-1')
  })

  it('parses valid one-based hashes into zero-based indices', () => {
    expect(indexFromHash('#slide-1', 3)).toBe(0)
    expect(indexFromHash('#slide-2', 3)).toBe(1)
    expect(indexFromHash('#slide-3', 3)).toBe(2)
  })

  it.each([
    '',
    'slide-2',
    '#slide-',
    '#slide-0',
    '#slide--1',
    '#slide-1.5',
    '#slide-01',
    '#slide-2x',
    '#other-2',
    '#slide-4',
  ])('safely resolves invalid or out-of-range hash %s to the cover', (hash) => {
    expect(indexFromHash(hash, 3)).toBe(0)
  })

  it('recognizes semantic controls and their descendants as deck-interactive', () => {
    const host = document.createElement('div')
    host.innerHTML = `
      <button><span id="button-child">Next option</span></button>
      <a href="#slide-2" id="link">Jump</a>
      <input id="input" />
      <textarea id="textarea"></textarea>
      <select id="select"><option>One</option></select>
      <details><summary id="summary">Details</summary></details>
      <div contenteditable="true" id="editable">Edit</div>
    `

    for (const id of ['button-child', 'link', 'input', 'textarea', 'select', 'summary', 'editable']) {
      expect(isDeckInteractiveTarget(host.querySelector(`#${id}`))).toBe(true)
    }

    const buttonText = host.querySelector('#button-child')?.firstChild
    expect(isDeckInteractiveTarget(buttonText ?? null)).toBe(true)
  })

  it('recognizes any descendant of a custom deck-interactive region', () => {
    const control = document.createElement('div')
    control.dataset.deckInteractive = 'true'
    control.innerHTML = '<span><svg id="custom-child"></svg></span>'

    expect(isDeckInteractiveTarget(control.querySelector('#custom-child'))).toBe(true)
  })

  it('does not classify ordinary content or non-DOM targets as interactive', () => {
    expect(isDeckInteractiveTarget(document.createElement('p'))).toBe(false)
    expect(isDeckInteractiveTarget(window)).toBe(false)
    expect(isDeckInteractiveTarget(null)).toBe(false)
  })
})
