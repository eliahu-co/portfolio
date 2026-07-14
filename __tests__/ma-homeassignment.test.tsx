// __tests__/ma-homeassignment.test.tsx
import { render } from '@testing-library/react'
import MAHomeAssignmentPage, { metadata } from '@/app/MA-HomeAssignment/page'
import * as DemoPage from '@/app/MA-HomeAssignment/demo/page'
import { USE_CASE_2 } from '@/app/MA-HomeAssignment/sections/useCaseData'

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

it('renders every side-nav section anchor', () => {
  render(<MAHomeAssignmentPage />)
  const ids = [
    'hero', 'feature-1', 'feature-2', 'feature-3',
    'prioritization', 'mvp', 'prototype', 'assumptions',
  ]
  for (const id of ids) {
    expect(document.getElementById(id)).toBeInTheDocument()
  }
})

it('renders the Coin Master hero banner', () => {
  render(<MAHomeAssignmentPage />)
  const band = document.getElementById('top')!
  // Coin Master sky/clouds header band (masthead)
  expect(band.className).toContain('coinmaster-sky')
  // chunky display font applied to the title
  const h1 = band.querySelector('h1')!
  expect(h1.className).toContain('text-cm-violet-deep')
})

it('renders the current workflow and the concept mockup in each feature', () => {
  render(<MAHomeAssignmentPage />)
  const feature1 = document.getElementById('feature-1')!
  // concept mockup image sits beside the current workflow
  expect(feature1.querySelector('img[src="/coinmaster/feature1.png"]')).not.toBeNull()
})

it('uses distinct Card Bounty artwork for the feature and prototype previews', () => {
  render(<MAHomeAssignmentPage />)

  expect(USE_CASE_2.mockup).toBe('/coinmaster/feature2.png')
  expect(document.querySelector('#feature-2 img[src="/coinmaster/feature2.png"]')).not.toBeNull()
  expect(document.querySelector('#prototype img[src="/coinmaster/prototype.png"]')).not.toBeNull()
  expect(USE_CASE_2.mockup).not.toBe('/coinmaster/prototype.png')
})

it('publishes the Card Bounty poster in the assignment social metadata', () => {
  expect(metadata.openGraph).toEqual(expect.objectContaining({
    images: [expect.objectContaining({
      url: 'https://eliahu.co/coinmaster/card-bounty-preview.jpg',
      width: 860,
      height: 1864,
    })],
  }))
  expect(metadata.twitter).toEqual(expect.objectContaining({
    images: ['https://eliahu.co/coinmaster/card-bounty-preview.jpg'],
  }))
})

it('uses a device-width viewport for the interactive prototype', () => {
  expect((DemoPage as Record<string, unknown>).viewport).toEqual({
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
  })
})

it('publishes the Card Bounty poster in the prototype social metadata', () => {
  expect(DemoPage.metadata.openGraph).toEqual(expect.objectContaining({
    images: [expect.objectContaining({
      url: 'https://eliahu.co/coinmaster/card-bounty-preview.jpg',
      width: 860,
      height: 1864,
    })],
  }))
  expect(DemoPage.metadata.twitter).toEqual(expect.objectContaining({
    images: ['https://eliahu.co/coinmaster/card-bounty-preview.jpg'],
  }))
})

it('integrates the Card Bounty prototype without the previous demo placeholder', () => {
  render(<MAHomeAssignmentPage />)
  const prototype = document.getElementById('prototype')!

  expect(prototype.querySelectorAll('a[href="/MA-HomeAssignment/demo"]')).toHaveLength(1)
  expect(prototype.querySelector('img[src="/coinmaster/prototype.png"]')).not.toBeNull()
  expect(prototype.textContent).toContain('Coin-purchased Chests to fill the Bounty meter')
  expect(prototype.textContent).not.toMatch(/Drawing Analyzer|drop chance/i)
  expect(prototype.querySelector('video')).toBeNull()
})

it('uses body typography and feature-section bottom spacing for prioritization criteria', () => {
  render(<MAHomeAssignmentPage />)
  const section = document.getElementById('prioritization')!
  const formula = Array.from(section.querySelectorAll('p')).find((node) =>
    node.textContent?.startsWith('Opportunity Score =')
  )!
  const calculationSummary = Array.from(section.querySelectorAll('p')).find((node) =>
    node.textContent?.startsWith('The calculation favors opportunities')
  )!
  const scoringMethod = calculationSummary.parentElement!
  const criteriaButtons = Array.from(section.querySelectorAll('button[aria-expanded]'))
  const criteriaWrapper = criteriaButtons[0].parentElement?.parentElement

  expect(formula.className).toContain('font-sans')
  expect(formula.className).toContain('text-[14px]')
  expect(formula.className).toContain('font-normal')
  expect(formula.className).toContain('text-charcoal')
  expect(formula.className).toContain('border-cm-gold')
  expect(scoringMethod.className).toContain('gap-3')
  expect(scoringMethod.className).toContain('mb-3')
  expect(scoringMethod.className).not.toContain('mb-8')

  expect(criteriaButtons).toHaveLength(4)
  for (const button of criteriaButtons) {
    const arrow = button.querySelector('span[aria-hidden="true"]')!
    const label = button.querySelector('span:not([aria-hidden])')!
    expect(label.className).toContain('font-sans')
    expect(label.className).toContain('text-[14px]')
    expect(label.className).toContain('font-normal')
    expect(label.className).toContain('text-charcoal')
    expect(arrow.className).toContain('text-cm-wood/60')
    expect(button.className).toContain('border-cm-wood')
  }

  expect(criteriaWrapper?.className).toContain('mb-6')
})

it('renders the approved MVP intro and scope copy', () => {
  const expectedInScope = [
    'Entry point within the Cards Center, with an event countdown.',
    'Target one missing Card at a time.',
    'Meter goal scales with Card rarity.',
    'Target locks after the first Chest contributes to the meter.',
    'Buying Chests advances the meter; higher-value Chests contribute more.',
    'If the target is obtained before the meter is filled, the player can select a new target and the meter resets.',
    'Reaching the meter goal awards the target, and ends the event for that player.',
    'Uncompleted progress expires when the event ends.',
  ]
  const expectedOutOfScope = [
    'Targeting Gold, Diamond or Seasonal Cards.',
    'Milestone rewards before the target Card.',
    'New Chest types or changes to existing Chest prices, contents or drop rates.',
    'Event-specific purchase bundles.',
    'Gameplay outside the existing Chest-opening flow.',
  ]

  render(<MAHomeAssignmentPage />)
  const section = document.getElementById('mvp')!
  const intro = Array.from(section.querySelectorAll('p')).find((node) =>
    node.textContent?.startsWith('The MVP answers one question:')
  )
  const labels = Array.from(section.querySelectorAll('p'))
  const inScope = labels.find((node) => node.textContent === 'In scope')!.parentElement!
  const outOfScope = labels.find((node) => node.textContent === 'Out of scope')!.parentElement!
  const listText = (container: Element) =>
    Array.from(container.querySelectorAll('li')).map((item) => item.textContent?.slice(1))

  expect(intro?.textContent).toBe(
    'The MVP answers one question: does a visible, guaranteed path to a chosen Card increase Coin spend on Chests, and does that lift ARPDAU? It ships as a time limited LiveOps event inside the Cards Center. Duration and balancing parameters come from internal player and economy data.'
  )
  expect(listText(inScope)).toEqual(expectedInScope)
  expect(listText(outOfScope)).toEqual(expectedOutOfScope)
  expect(section.textContent).not.toContain('Purchasing meter progress or the guaranteed Card directly.')
})
