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

it('aligns hero content to the full column without resizing the logo', () => {
  render(<MAHomeAssignmentPage />)
  const hero = document.getElementById('top')!
  const logo = hero.querySelector('img[data-hero-logo="desktop"]')!
  const contactRow = Array.from(hero.querySelectorAll('p')).find((node) =>
    node.querySelector('a[href^="tel:"]')
  )!

  expect(logo.className).toContain('right-0')
  expect(logo.className).not.toContain('right-[60px]')
  expect(logo.className).toContain('h-[clamp(80px,10vw,112px)]')
  expect(contactRow.className).not.toContain('max-w-2xl')
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

it('renders the approved intro research copy', () => {
  render(<MAHomeAssignmentPage />)
  const intro = document.getElementById('hero')!
  const research = Array.from(intro.querySelectorAll('p')).find((node) =>
    node.textContent?.startsWith('I used official support pages')
  )

  expect(research?.textContent).toBe(
    'I used official support pages, advanced gameplay, player communities and industry analysis to cover systems that I had not reached yet. I compared Coin Master with Monopoly GO! and Dice Dreams, then reviewed Royal Match and Whiteout Survival for transferable collection, guarantee, customization, social, PvP and LiveOps mechanics.'
  )
  expect(intro.textContent).not.toContain('Using this map, I looked for ARPDAU opportunities')
  expect(intro.textContent).not.toContain('I played Coin Master with a product lens')
})

it('renders the approved intro framing copy at the full content width', () => {
  render(<MAHomeAssignmentPage />)
  const intro = document.getElementById('hero')!
  const framing = Array.from(intro.querySelectorAll('p')).find((node) =>
    node.textContent?.startsWith('I developed three concepts')
  )!

  expect(framing.textContent).toBe(
    'I developed three concepts, each targeting a different path to ARPDAU growth: a new spend surface, deeper spending or more purchase opportunities through re-engagement.'
  )
  expect(intro.className).not.toContain('max-w-2xl')
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
  const tooltips = Array.from(document.body.querySelectorAll('[id^="criterion-"][role="tooltip"]'))
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

it('renders success metrics as one grouped table with contextual funnel help', () => {
  const expectedGroups = [
    {
      title: 'North Star',
      rows: [['ARPDAU', '≥5% lift']],
    },
    {
      title: 'Monetization and economy drivers',
      rows: [
        ['ARPPU', '≥5% lift overall and ≥8% among the high-spender cohort'],
        ['Coin spend on Chests per DAU', '≥10% lift'],
        ['Total Coin Consumption per DAU', '≥5% lift'],
      ],
    },
    {
      title: 'Feature funnel',
      rows: [
        ['Target Selection Rate', '≥30% of eligible DAU'],
        ['First-Chest Conversion', '≥65% of players who select a target'],
        ['Bounty Completion Rate', '10–20% of activated players'],
      ],
    },
    {
      title: 'Guardrails',
      rows: [
        ['Post-Event Revenue per Player', '≥98%'],
        ['Post-Event Chest Coin Spend per Player', '≥95%'],
        ['Card Collections Completed per Player', '≤115%'],
        ['Village Upgrades per Player', '≥95%'],
      ],
    },
  ]

  render(<MAHomeAssignmentPage />)
  const mvp = document.getElementById('mvp')!
  const heading = Array.from(mvp.querySelectorAll('h2')).find(
    (node) => node.textContent === 'Success metrics'
  )!
  const metrics = heading.parentElement!
  const tables = Array.from(metrics.querySelectorAll('table'))
  const table = tables[0]
  const groups = Array.from(metrics.querySelectorAll('tbody[data-metric-group]'))
  const introduction = Array.from(metrics.querySelectorAll('p')).find((node) =>
    node.textContent?.startsWith('Eligible players')
  )!
  const tooltip = metrics.querySelector('[role="tooltip"]')!
  const infoButtons = Array.from(metrics.querySelectorAll('button[aria-describedby]'))

  expect(introduction.textContent).toBe(
    'Eligible players have the Cards Center unlocked and at least one targetable missing Card. Event metrics use eligible players active each day; post event guardrails use the full eligible group. All results compare treatment with control.'
  )
  expect(tables).toHaveLength(1)
  expect(table.querySelectorAll('thead')).toHaveLength(1)
  expect(Array.from(table.querySelectorAll('thead th')).map((cell) => cell.textContent?.trim())).toEqual([
    'Metric',
    'Proposed target',
  ])
  expect(groups).toHaveLength(4)
  expectedGroups.forEach(({ title, rows }, index) => {
    const group = groups[index]
    const renderedRows = Array.from(group.querySelectorAll('tr[data-metric-row]')).map((row) =>
      Array.from(row.querySelectorAll('td')).map((cell) => cell.textContent?.trim())
    )

    expect(group.getAttribute('data-metric-group')).toBe(title)
    expect(group.querySelector('h3 > span')?.textContent).toBe(title)
    expect(renderedRows).toEqual(rows)
    expect(group.querySelector('tr[data-metric-row]')?.className).toContain('border-charcoal/15')
  })
  expect(table.className).not.toContain('min-w-')
  expect(table.parentElement?.className).not.toContain('overflow-x-auto')
  const tableHeaderRow = table.querySelector('thead tr')!
  const groupHeaderRows = groups.map((group) => group.querySelector('tr')!)
  const northStarRow = groups[0].querySelector('tr[data-metric-row]')!
  const northStarTarget = northStarRow.querySelector('td:last-child')!

  expect(tableHeaderRow.className).not.toContain('border-b-2')
  expect(tableHeaderRow.className).not.toContain('border-cm-wood')
  expect(groupHeaderRows[0].className).toContain('border-b-2')
  expect(groupHeaderRows[0].className).toContain('border-cm-wood')
  groupHeaderRows.slice(1).forEach((row) => {
    expect(row.className).toContain('border-b-2')
    expect(row.className).toContain('border-charcoal/25')
  })
  expect(groups[0].className).not.toContain('border-l-4')
  expect(groups[0].className).not.toContain('animate-shimmer')
  expect(groups[0].className).not.toContain('border-[#C77F14]')
  expect(groups[0].getAttribute('style')).toBeNull()
  expect(northStarRow.className).toContain('animate-shimmer')
  expect(northStarRow.className).toContain('motion-reduce:animate-none')
  expect(northStarRow.getAttribute('style')).toContain(
    'linear-gradient(90deg, rgba(245,168,0,0.08) 0%, rgba(245,168,0,0.28) 50%, rgba(245,168,0,0.08) 100%)'
  )
  expect(northStarTarget.className).toContain('text-charcoal')
  expect(northStarTarget.className).not.toContain('text-cm-crimson')
  expect(infoButtons).toHaveLength(1)
  expect(infoButtons[0].getAttribute('aria-label')).toBe('About Feature funnel')
  expect(infoButtons[0].getAttribute('aria-describedby')).toBe(tooltip.id)
  expect(tooltip.textContent).toBe(
    'The funnel is coherent: 30% × 65% ≈ 20% activation. The completion range ensures the guarantee provides value without becoming too easy.'
  )
  expect(tooltip.className).toContain('group-hover:visible')
  expect(tooltip.className).toContain('group-focus-within:visible')
  expect(metrics.querySelectorAll('p.mt-3.border-l-4')).toHaveLength(0)
  expect(metrics.textContent).not.toContain('Role')
  expect(metrics.querySelectorAll('span.rounded-full')).toHaveLength(0)
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
