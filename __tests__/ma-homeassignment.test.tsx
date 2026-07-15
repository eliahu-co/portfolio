// __tests__/ma-homeassignment.test.tsx
import { fireEvent, render } from '@testing-library/react'
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
  const desktopLogo = band.querySelector('img[data-hero-logo="desktop"]')!
  const mobileLogo = band.querySelector('img[data-hero-logo="mobile"]')!
  const titleRow = h1.parentElement!
  expect(titleRow.dataset.heroTitleRow).toBe('true')
  expect(titleRow).toContainElement(desktopLogo)
  expect(desktopLogo.className).toContain('top-[calc(50%_-_6px)]')
  expect(desktopLogo.className).toContain('-translate-y-1/2')
  expect(mobileLogo.className).toContain('md:hidden')
})

it('matches the intro body size to the Concept copy', () => {
  render(<MAHomeAssignmentPage />)
  const intro = Array.from(document.querySelectorAll('#hero p')).find((node) =>
    node.textContent?.startsWith('Coin Master’s core')
  )!
  const concept = Array.from(document.querySelectorAll('#feature-1 p')).find((node) =>
    node.textContent?.startsWith('Villages show progression')
  )!

  expect(concept.className).toContain('text-[14px]')
  expect(intro.className).toContain('text-[14px]')
  expect(intro.className).not.toContain('text-[15px]')
})

it('renders the current workflow and the concept mockup in each feature', () => {
  render(<MAHomeAssignmentPage />)
  const feature1 = document.getElementById('feature-1')!
  // concept mockup image sits beside the current workflow
  expect(feature1.querySelector('img[src="/coinmaster/feature1.png"]')).not.toBeNull()
})

it('renders risk cards without a background fill', () => {
  render(<MAHomeAssignmentPage />)
  const riskTitle = Array.from(document.querySelectorAll('#feature-1 p')).find((node) =>
    node.textContent === 'Core Cannibalization'
  )!
  const riskCard = riskTitle.parentElement!

  expect(riskCard.className).toContain('border-cm-crimson/35')
  expect(riskCard.className).toContain('shadow-[')
  expect(riskCard.className).not.toContain('bg-')
  expect(riskCard.className).not.toContain('from-[')
  expect(riskCard.className).not.toContain('to-[')
})

it('uses distinct Card Bounty artwork for the feature and prototype previews', () => {
  render(<MAHomeAssignmentPage />)

  expect(USE_CASE_2.mockup).toBe('/coinmaster/feature2.png')
  expect(document.querySelector('#feature-2 img[src="/coinmaster/feature2.png"]')).not.toBeNull()
  expect(document.querySelector('#prototype img[src="/coinmaster/prototype.webp"]')).not.toBeNull()
  expect(USE_CASE_2.mockup).not.toBe('/coinmaster/prototype.webp')
})

it('publishes the assignment miniature in the assignment social metadata', () => {
  expect(metadata.openGraph).toEqual(expect.objectContaining({
    images: [expect.objectContaining({
      url: 'https://eliahu.co/coinmaster/OGMiniature.jpg',
      width: 1200,
      height: 630,
    })],
  }))
  expect(metadata.twitter).toEqual(expect.objectContaining({
    images: ['https://eliahu.co/coinmaster/OGMiniature.jpg'],
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

it('renders the interactive prototype inside MVP without the old introduction', () => {
  render(<MAHomeAssignmentPage />)
  const mvp = document.getElementById('mvp')!
  const prototype = document.getElementById('prototype')!
  const heading = Array.from(mvp.querySelectorAll('h2')).find(
    (node) => node.textContent === 'Interactive prototype'
  )!
  const successMetrics = Array.from(mvp.querySelectorAll('h2')).find(
    (node) => node.textContent === 'Success metrics'
  )!
  const previewLink = prototype.querySelector('a[href="/MA-HomeAssignment/demo"]')!
  const buttonLabel = previewLink.querySelector('span')!

  expect(mvp.contains(prototype)).toBe(true)
  expect(prototype.contains(heading)).toBe(true)
  expect(prototype.querySelectorAll('a[href="/MA-HomeAssignment/demo"]')).toHaveLength(1)
  expect(prototype.querySelector('img[src="/coinmaster/prototype.webp"]')).not.toBeNull()
  expect(buttonLabel.textContent?.trim()).toBe('Open')
  expect(buttonLabel.querySelector('svg')).not.toBeNull()
  expect(previewLink.getAttribute('aria-label')).toBe('Open the Card Bounty interactive prototype')
  expect(prototype.compareDocumentPosition(successMetrics) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  expect(document.body.textContent).not.toContain('Prototype demo')
  expect(document.body.textContent).not.toContain('Card Bounty, interactive')
  expect(document.body.textContent).not.toContain('An interactive concept prototype of Card Bounty')
})

it('exposes scoring definitions through accessible table-header tooltips', () => {
  const expectedCriteria = [
    {
      title: 'ARPDAU Impact',
      body: 'Potential to increase average daily revenue per active user if successful.',
      rubric: ['5Multiple direct monetization levers with significant upside.', '3Meaningful but bounded or indirect revenue impact.', '1Weak or speculative path to ARPDAU.'],
    },
    {
      title: 'Core-Loop Fit',
      body: 'Degree to which the feature builds on existing Coin Master mechanics and player behavior.',
      rubric: ['5Directly reinforces the existing core or meta loop.', '3Connects to existing systems but introduces meaningful new behavior.', '1Sits largely outside the current loop.'],
    },
    {
      title: 'Confidence',
      body: 'Strength of the evidence that players will adopt the feature and produce the intended economy and monetization behavior.',
      rubric: ['5Supported by clear player behavior and proven category mechanics.', '3Credible hypothesis with adoption or economy risk.', '1Limited evidence and significant uncertainty.'],
    },
    {
      title: 'Effort',
      body: 'Relative product, design, engineering and balancing effort required to deliver a valuable MVP.',
      rubric: ['5Major new systems, economy work or cross-feature dependencies.', '3Moderate implementation and balancing effort.', '1Bounded extension of an existing mechanic.'],
    },
  ]

  render(<MAHomeAssignmentPage />)
  const section = document.getElementById('prioritization')!
  const formula = Array.from(section.querySelectorAll('p')).find((node) =>
    node.textContent?.startsWith('Opportunity Score =')
  )!
  const calculationSummary = Array.from(section.querySelectorAll('p')).find((node) =>
    node.textContent?.startsWith('The calculation favors opportunities')
  )!
  const scoringMethod = calculationSummary.parentElement!
  const headers = Array.from(section.querySelectorAll('[data-criterion-header]'))
  const infoButtons = Array.from(section.querySelectorAll('button[aria-describedby]'))
  const tooltips = Array.from(document.body.querySelectorAll('[role="tooltip"]'))
  const tableScroller = section.querySelector('.overflow-x-auto')!

  expect(formula.className).toContain('font-sans')
  expect(formula.className).toContain('text-[14px]')
  expect(formula.className).toContain('font-normal')
  expect(formula.className).toContain('text-charcoal')
  expect(formula.className).toContain('border-cm-gold')
  expect(scoringMethod.className).toContain('gap-3')
  expect(scoringMethod.className).toContain('mb-6')

  expect(headers).toHaveLength(4)
  expect(infoButtons).toHaveLength(4)
  expect(tooltips).toHaveLength(4)

  fireEvent.mouseEnter(headers[0])
  expect(tooltips[0].getAttribute('aria-hidden')).toBe('false')
  fireEvent.mouseLeave(headers[0])
  expect(tooltips[0].getAttribute('aria-hidden')).toBe('true')

  expectedCriteria.forEach(({ title, body, rubric }, index) => {
    const header = headers[index]
    const button = infoButtons[index]
    const tooltip = tooltips[index]

    expect(header.getAttribute('data-criterion-header')).toBe(title)
    expect(header.className).toContain('group')
    expect(button.getAttribute('aria-label')).toBe(`About ${title}`)
    expect(button.getAttribute('aria-describedby')).toBe(tooltip.id)
    expect(button.className).toContain('h-3.5')
    expect(button.className).toContain('w-3.5')
    expect(tooltip.textContent).toContain(body)
    expect(tooltip.className).toContain('fixed')
    expect(tableScroller.contains(tooltip)).toBe(false)
    expect(Array.from(tooltip.querySelectorAll('[data-rubric-item]')).map((item) => item.textContent?.replace(/\s/g, ''))).toEqual(
      rubric.map((item) => item.replace(/\s/g, ''))
    )
  })

  expect(section.querySelectorAll('button[aria-expanded]')).toHaveLength(0)
  expect(section.textContent).not.toContain('▶')
})

it('renders the approved MVP intro and scope copy', () => {
  const expectedInScope = [
    'Entry point within the Cards Center, with an event countdown.',
    'Target one missing Card at a time.',
    'Meter goal scales with the target Card’s star rating.',
    'Buying Chests advances the meter; higher-value Chests contribute more.',
    'Changing the target resets the meter.',
    'If the target is obtained before the meter is filled, the player can change target.',
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
  const scopeContainer = inScope.parentElement!
  const listText = (container: Element) =>
    Array.from(container.querySelectorAll('li')).map((item) => item.textContent?.slice(1))

  expect(intro?.textContent).toBe(
    'The MVP answers one question: does a visible, guaranteed path to a chosen Card increase Coin spend on Chests, and does that lift ARPDAU? It ships as a time limited LiveOps event inside the Cards Center. Duration and balancing parameters come from internal player and economy data.'
  )
  expect(listText(inScope)).toEqual(expectedInScope)
  expect(listText(outOfScope)).toEqual(expectedOutOfScope)
  expect(scopeContainer).toBe(outOfScope.parentElement)
  expect(scopeContainer.className).not.toContain('md:grid-cols-2')
  expect(scopeContainer.className).toContain('max-w-3xl')
  expect(scopeContainer.className).toContain('gap-y-8')
  expect(section.textContent).not.toContain('Purchasing meter progress or the guaranteed Card directly.')
})

it('renders the approved editorial success metrics table', () => {
  const expectedRows = [
    ['ARPDAU', 'Primary', '+5% or more'],
    ['Coin spend on Chests per DAU', 'Economy', '+10% or more'],
    ['Total Coin Consumption per DAU', 'Economy', '+5% or more'],
    ['Bounty Activation Rate', 'Adoption', '20% or more of eligible daily active players select a target and open at least one Coin-purchased Chest'],
    ['Post-Event Revenue per Player', 'Guardrail', 'Stable or higher: at least 98% of control during the following seven days'],
    ['Post-Event Chest Coin Spend per Player', 'Guardrail', 'Stable or higher: at least 95% of control during the following seven days'],
    ['Card Collections Completed per Player', 'Guardrail', 'No more than 15% above control across the event and following seven days'],
    ['Village Upgrades per Player', 'Guardrail', 'Stable or higher: at least 95% of control across the event and following seven days'],
  ]

  render(<MAHomeAssignmentPage />)
  const mvp = document.getElementById('mvp')!
  const heading = Array.from(mvp.querySelectorAll('h2')).find(
    (node) => node.textContent === 'Success metrics'
  )!
  const metrics = heading.parentElement!
  const table = metrics.querySelector('table')

  expect(table).not.toBeNull()
  if (!table) return

  const headers = Array.from(table.querySelectorAll('th')).map((cell) => cell.textContent?.trim())
  const rows = Array.from(table.querySelectorAll('tbody tr')).map((row) =>
    Array.from(row.querySelectorAll('td')).map((cell) => cell.textContent?.trim())
  )
  const introduction = Array.from(metrics.querySelectorAll('p')).find((node) =>
    node.textContent?.startsWith('Eligible players')
  )!
  const roleHeader = table.querySelectorAll('th')[1]
  const rolePills = Array.from(table.querySelectorAll('tbody td:nth-child(2) span'))

  expect(headers).toEqual(['Metric', 'Role', 'Proposed target'])
  expect(rows).toEqual(expectedRows)
  expect(introduction.textContent).toBe(
    'Eligible players have the Cards Center unlocked and at least one targetable missing Card. Event metrics use eligible players active each day; post event guardrails use the full eligible group. All results compare treatment with control.'
  )
  expect(roleHeader.querySelector('.sr-only')?.textContent).toBe('Role')
  expect(roleHeader.childNodes).toHaveLength(1)
  expect(rolePills).toHaveLength(8)
  for (const pill of rolePills) {
    expect(pill.className).toContain('border')
    expect(pill.className).toContain('w-20')
    expect(pill.className).toContain('justify-center')
  }
  expect(rolePills[0].className).toContain('border-cm-wood/50')
  expect(rolePills[1].className).toContain('border-[#0F3D54]/40')
  expect(rolePills[3].className).toContain('border-[#0F3D54]/40')
  expect(rolePills[4].className).toContain('border-cm-violet-deep/30')
  expect(table.className).toContain('min-w-[720px]')
  expect(table.parentElement?.className).toContain('overflow-x-auto')
  expect(table.querySelector('thead tr')?.className).toContain('border-cm-wood')
  expect(table.querySelector('tbody tr')?.className).toContain('border-charcoal/15')
  expect(metrics.textContent).not.toContain('Success signal')
  expect(metrics.querySelectorAll('div.border-l-4')).toHaveLength(0)
})

it('renders Assumptions without decorative dash markers', () => {
  render(<MAHomeAssignmentPage />)
  const assumptions = document.getElementById('assumptions')!
  const items = Array.from(assumptions.querySelectorAll('li'))

  expect(items).toHaveLength(6)
  for (const item of items) {
    expect(item.querySelector('[aria-hidden="true"]')).toBeNull()
    expect(item.textContent?.trim().startsWith('—')).toBe(false)
    expect(item.className).not.toContain('flex')
    expect(item.className).not.toContain('gap-2')
  }
})
