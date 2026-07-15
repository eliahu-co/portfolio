// __tests__/ma-homeassignment.test.tsx
import { fireEvent, render } from '@testing-library/react'
import MAHomeAssignmentPage, { metadata } from '@/app/MA-HomeAssignment/page'
import * as DemoPage from '@/app/MA-HomeAssignment/demo/page'
import { USE_CASE_1, USE_CASE_2, USE_CASE_3 } from '@/app/MA-HomeAssignment/sections/useCaseData'

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

it('renders every side-nav section anchor', () => {
  render(<MAHomeAssignmentPage />)
  const ids = [
    'hero', 'feature-1', 'feature-2', 'feature-3',
    'prioritization', 'mvp', 'prototype', 'validation', 'assumptions',
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
    node.textContent?.startsWith('Friend visits currently display')
  )!

  expect(concept.className).toContain('text-[14px]')
  expect(intro.className).toContain('text-[14px]')
  expect(intro.className).not.toContain('text-[15px]')
})

it('prepends the current friend-visit limitation to the Hometown concept', () => {
  const previousIntro =
    'Villages show progression, not ownership: completed items disappear once the player advances. Hometown gives them lasting utility through a familiar five-slot space that they can customize and gives friend visits a purpose. Building items costs Coins and rewards with a discount on the next Village build. Backdrops and item variants are unlocked through progression, LiveOps or purchase.'

  expect(USE_CASE_1.problem.intro).toBe(
    `Friend visits currently display the friend’s active Village and offer no interaction. ${previousIntro}`
  )
})

it('renders the approved intro research copy', () => {
  render(<MAHomeAssignmentPage />)
  const intro = document.getElementById('hero')!
  const research = Array.from(intro.querySelectorAll('p')).find((node) =>
    node.textContent?.startsWith('I played the game and used official support pages')
  )

  expect(research?.textContent).toBe(
    'I played the game and used official support pages, advanced gameplay, player communities and industry analysis to cover systems that I had not reached yet. I compared Coin Master with Monopoly GO! and Dice Dreams, then reviewed Royal Match and Whiteout Survival for transferable collection, guarantee, customization, social, PvP and LiveOps mechanics.'
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

it('defines the approved monetization strategy and metrics for every feature', () => {
  expect([
    {
      title: USE_CASE_1.title,
      strategy: USE_CASE_1.monetizationStrategy,
      metrics: USE_CASE_1.metrics,
    },
    {
      title: USE_CASE_2.title,
      strategy: USE_CASE_2.monetizationStrategy,
      metrics: USE_CASE_2.metrics,
    },
    {
      title: USE_CASE_3.title,
      strategy: USE_CASE_3.monetizationStrategy,
      metrics: USE_CASE_3.metrics,
    },
  ]).toEqual([
    {
      title: 'Hometown',
      strategy: 'New spend surface',
      metrics: {
        primary: 'ARPDAU',
        supporting: [
          'Coin spend on Hometown per DAU',
          'Repeat customization',
          'Return sessions per Hometown user',
        ],
      },
    },
    {
      title: 'Card Bounty',
      strategy: 'Resource demand. Targets players close to completing a Card Collection increasing Coin consumption and demand for existing offers.',
      metrics: {
        primary: 'ARPDAU',
        supporting: [
          'ARPPU by payer tier',
          'Coin Spend on Chests per DAU',
          'Bounty activation',
        ],
      },
    },
    {
      title: 'Hot Trail',
      strategy: 'Purchase frequency through re-engagement.',
      metrics: {
        primary: 'ARPDAU',
        supporting: [
          'Hot Trail activation',
          'Return rate',
          'Spin consumption per exposed DAU',
        ],
      },
    },
  ])
})

it('renders monetization strategy before metrics with the existing metric bullets', () => {
  render(<MAHomeAssignmentPage />)

  const cases = [USE_CASE_1, USE_CASE_2, USE_CASE_3]
  cases.forEach((data) => {
    const feature = document.getElementById(data.id)!
    const businessCases = Array.from(feature.querySelectorAll('[data-feature-business-case]'))

    expect(businessCases).toHaveLength(2)
    expect(businessCases.map((node) => node.getAttribute('data-feature-business-case'))).toEqual([
      'mobile',
      'desktop',
    ])
    expect(feature.textContent).not.toContain('KPI')

    businessCases.forEach((businessCase) => {
      const labels = Array.from(businessCase.children).map((block) => block.children[0]?.textContent)
      const strategyBlock = businessCase.children[0]
      const metricsBlock = businessCase.children[1]
      const strategyParagraph = strategyBlock.querySelector('p:not(:first-child)')!
      const metricItems = Array.from(metricsBlock.querySelectorAll('li'))

      expect(labels).toEqual(['Monetization Strategy', 'Metrics'])
      expect(strategyParagraph.querySelector('strong')).toBeNull()
      expect(strategyParagraph.textContent).toBe(data.monetizationStrategy)
      expect(metricItems.map((item) => item.querySelector('span:last-child')?.textContent)).toEqual([
        data.metrics?.primary,
        ...data.metrics!.supporting,
      ])
      expect(metricItems[0].querySelector('[aria-hidden="true"]')?.textContent).toBe('★')
      metricItems.slice(1).forEach((item) => {
        expect(item.querySelector('[aria-hidden="true"]')?.textContent).toBe('◆')
      })
    })
  })
})

it('uses the requested compact and relaxed subtitle spacing', () => {
  render(<MAHomeAssignmentPage />)

  const expectSpacing = (scope: HTMLElement, label: string, spacing: 'mb-1' | 'mb-3') => {
    const headings = Array.from(scope.querySelectorAll('p')).filter((node) => node.textContent === label)
    expect(headings.length).toBeGreaterThan(0)
    headings.forEach((heading) => expect(heading.className).toContain(spacing))
  }

  ;[USE_CASE_1, USE_CASE_2, USE_CASE_3].forEach((data) => {
    const feature = document.getElementById(data.id)!
    expectSpacing(feature, 'Concept', 'mb-1')
    expectSpacing(feature, 'Monetization Strategy', 'mb-1')
    expectSpacing(feature, 'Metrics', 'mb-1')
    expectSpacing(feature, 'Loop', 'mb-3')
    expectSpacing(feature, 'Player motivation & risks', 'mb-3')
  })

  const validation = document.getElementById('validation')!
  ;['Population', 'Control', 'Treatment', 'Hypothesis'].forEach((label) => {
    expectSpacing(validation, label, 'mb-1')
  })
})

it('defines the approved player motivations and plain monetization strategies', () => {
  expect([USE_CASE_1, USE_CASE_2, USE_CASE_3].map((data) => ({
    title: data.title,
    strategy: data.monetizationStrategy,
    motivations: data.value,
    risks: data.tradeoffs,
  }))).toEqual([
    {
      title: 'Hometown',
      strategy: 'New spend surface',
      motivations: [
        { title: 'Expression and Ownership', body: 'A permanent space that feels personal.' },
        { title: 'Progress and Status', body: 'High-level Village items become proof of progress.' },
        { title: 'Social Recognition', body: 'Visits, reactions and snapshots create an audience.' },
      ],
      risks: [
        { title: 'Core Cannibalization', body: 'May slow Village progression.' },
        { title: 'Paying Twice', body: 'Charging for Village built items may feel unfair.' },
        { title: 'Weak Customization Demand', body: 'Customization value depends on audience.' },
      ],
    },
    {
      title: 'Card Bounty',
      strategy: 'Resource demand. Targets players close to completing a Card Collection increasing Coin consumption and demand for existing offers.',
      motivations: [
        { title: 'Agency', body: 'Choose the Card that matters most.' },
        { title: 'Visible Progress', body: 'Every Chest advances toward a guaranteed result.' },
      ],
      risks: [
        { title: 'System Cannibalization', body: 'Reduced value of Jokers, trading and Cards for Chests.' },
        { title: 'Collection Acceleration', body: 'Collection rewards released faster than intended.' },
        { title: 'Spend Shifting', body: 'Chest spending shifts to the event without increasing total spend.' },
      ],
    },
    {
      title: 'Hot Trail',
      strategy: 'Purchase frequency through re-engagement.',
      motivations: [
        { title: 'Urgency', body: 'A limited window creates a reason to return.' },
        { title: 'Recovery and Revenge', body: 'Respond directly to a Raid and recover part of the loss.' },
      ],
      risks: [
        { title: 'Retaliation Loops', body: 'Repeated Counter-Raids between the same players.' },
        { title: 'Failed Urgency', body: 'Spins consumed without landing a Raid before the timer expires.' },
        { title: 'Economy Distortion', body: 'Recovered Coins inflate the economy or weaken core-loop demand.' },
      ],
    },
  ])
})

it('renders player motivation framing and unbolded monetization strategy copy', () => {
  render(<MAHomeAssignmentPage />)

  ;[USE_CASE_1, USE_CASE_2, USE_CASE_3].forEach((data) => {
    const feature = document.getElementById(data.id)!
    const motivationHeading = Array.from(feature.querySelectorAll('p')).find(
      (node) => node.textContent === 'Player motivation & risks'
    )
    const strategyHeadings = Array.from(feature.querySelectorAll('p')).filter(
      (node) => node.textContent === 'Monetization Strategy'
    )

    expect(motivationHeading).toBeDefined()
    expect(feature.textContent).not.toContain('Value delivered & risks')
    expect(strategyHeadings).toHaveLength(2)
    strategyHeadings.forEach((heading) => {
      const strategyParagraph = heading.parentElement!.querySelector('p:not(:first-child)')!
      expect(strategyParagraph.textContent).toBe(data.monetizationStrategy)
      expect(strategyParagraph.querySelector('strong')).toBeNull()
      expect(strategyParagraph.className).toContain('text-[14px]')
      expect(strategyParagraph.className).toContain('text-charcoal')
    })
  })
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
  const validation = document.getElementById('validation')!
  const previewLink = prototype.querySelector('a[href="/MA-HomeAssignment/demo"]')!
  const buttonLabel = previewLink.querySelector('span')!
  const buttonClasses = buttonLabel.className.split(/\s+/)

  expect(mvp.contains(prototype)).toBe(true)
  expect(prototype.contains(heading)).toBe(true)
  expect(prototype.querySelectorAll('a[href="/MA-HomeAssignment/demo"]')).toHaveLength(1)
  expect(prototype.querySelector('img[src="/coinmaster/prototype.webp"]')).not.toBeNull()
  expect(buttonLabel.textContent?.trim()).toBe('Open')
  expect(buttonLabel.querySelector('svg')).not.toBeNull()
  expect(buttonLabel.hasAttribute('data-prototype-cta')).toBe(true)
  expect(buttonClasses).toEqual(expect.arrayContaining([
    'left-3',
    'bottom-3',
    'md:bottom-auto',
    'md:left-[20%]',
    'md:top-[47%]',
    'md:-translate-x-1/2',
    'md:-translate-y-1/2',
    'group-hover:scale-[1.025]',
    'group-hover:brightness-105',
  ]))
  expect(buttonClasses).not.toContain('left-1/2')
  expect(buttonClasses).not.toContain('bottom-4')
  expect(buttonClasses).not.toContain('-translate-x-1/2')
  expect(buttonClasses).not.toContain('-translate-y-1/2')
  expect(buttonClasses).not.toContain('group-hover:-translate-y-0.5')
  expect(previewLink.getAttribute('aria-label')).toBe('Open the Card Bounty interactive prototype')
  expect(previewLink.getAttribute('target')).toBe('_blank')
  expect(previewLink.getAttribute('rel')).toBe('noopener noreferrer')
  expect(mvp.contains(validation)).toBe(false)
  expect(prototype.compareDocumentPosition(validation) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  expect(document.body.textContent).not.toContain('Prototype demo')
  expect(document.body.textContent).not.toContain('Card Bounty, interactive')
  expect(document.body.textContent).not.toContain('An interactive concept prototype of Card Bounty')
})

it('renders the standalone Feature Validation experiment after the prototype', () => {
  render(<MAHomeAssignmentPage />)
  const validation = document.getElementById('validation')!
  const expectedProtocol = [
    ['Population', 'Players with the Cards Center unlocked and at least one eligible missing Card.'],
    ['Control', 'Existing Cards Center.'],
    ['Treatment', 'Existing Cards Center with Card Bounty as a time-limited LiveOps event.'],
    ['Hypothesis', 'A visible guarantee for a chosen missing Card increases Coin-purchased Chest openings. Higher Coin consumption increases demand for existing Spin and Coin offers, lifting ARPDAU.'],
  ]

  expect(validation.querySelector('p')?.textContent).toBe('A/B Test')
  expect(validation.querySelector('h2')?.textContent).toBe('Feature Validation')
  expect(document.querySelector('a[href="#validation"]')?.textContent).toBe('Validation')

  expectedProtocol.forEach(([label, body]) => {
    const labelNode = Array.from(validation.querySelectorAll('p')).find((node) => node.textContent === label)!
    expect(labelNode.className).toContain('font-extrabold')
    expect(labelNode.className).toContain('tracking-[0.14em]')
    expect(labelNode.nextElementSibling?.textContent).toBe(body)
    expect(labelNode.parentElement?.className).not.toContain('border')
    expect(labelNode.parentElement?.className).not.toContain('bg-')
  })

  const comparison = validation.querySelector('[data-protocol-comparison]')!
  expect(comparison.className).toContain('grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]')
  expect(comparison.className).toContain('gap-x-4')
  expect(comparison.className).toContain('md:grid-cols-[160px_minmax(0,1fr)]')
  expect(comparison.className).toContain('md:gap-x-6')
  expect(Array.from(comparison.children).map((item) => item.firstElementChild?.textContent)).toEqual([
    'Control',
    'Treatment',
  ])

  expect(validation.textContent).not.toContain('Segmentation')
  expect(validation.textContent).not.toContain('Decision threshold')
  expect(document.body.textContent).not.toContain('Success metrics')
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

it('renders Feature Validation as a role-pill experiment table with contextual funnel help', () => {
  const expectedGroups = [
    {
      title: 'Primary metric',
      rows: [['ARPDAU', '', '≥5% lift']],
    },
    {
      title: 'Supporting metrics',
      rows: [
        ['ARPPU by payer tier', 'Monetization', '≥5% lift overall and ≥8% among the high-spender cohort'],
        ['Coin spend on Chests per DAU', 'Economy', '≥10% lift'],
        ['Total Coin Consumption per DAU', 'Economy', '≥5% lift'],
        ['Target Selection Rate', 'Feature funnel', '≥30% of eligible DAU'],
        ['First-Chest Conversion', 'Feature funnel', '≥65% of players who select a target'],
        ['Bounty Completion Rate', 'Feature funnel', '10–20% of activated players'],
      ],
    },
    {
      title: 'Guardrails',
      rows: [
        ['Card Collections Completed per Player', '', '≤115%'],
        ['Village Upgrades per Player', '', '≥95%'],
        ['Post-Event Coin Spend on Chests per Player', '', '≥95%'],
        ['Post-Event Revenue per Player', '', '≥98%'],
      ],
    },
  ]

  render(<MAHomeAssignmentPage />)
  const metrics = document.getElementById('validation')!
  const tables = Array.from(metrics.querySelectorAll('table'))
  const table = tables[0]
  const groups = Array.from(metrics.querySelectorAll('tbody[data-metric-group]'))
  const tooltip = document.getElementById('feature-funnel-tooltip')!
  const infoButtons = Array.from(metrics.querySelectorAll('button[aria-describedby]'))
  const rolePills = Array.from(metrics.querySelectorAll('[data-metric-role]'))

  expect(tables).toHaveLength(1)
  expect(table.querySelectorAll('thead')).toHaveLength(0)
  expect(groups).toHaveLength(3)
  const primaryHeadings = Array.from(groups[0].querySelectorAll('tr:first-child th'))
  expect(primaryHeadings.map((cell) => cell.textContent?.trim())).toEqual([
    'Primary metric',
    'Proposed target',
  ])
  expect(primaryHeadings[0].getAttribute('colspan')).toBe('2')
  expect(primaryHeadings[1].className).toContain('pl-3')
  expect(primaryHeadings[1].className).toContain('text-left')
  expectedGroups.forEach(({ title, rows }, index) => {
    const group = groups[index]
    const renderedRows = Array.from(group.querySelectorAll('tr[data-metric-row]')).map((row) => [
      row.querySelector('[data-metric-name]')?.textContent?.trim(),
      row.querySelector('[data-metric-role]')?.textContent?.trim() ?? '',
      row.querySelector('[data-metric-target]')?.textContent?.trim(),
    ])

    expect(group.getAttribute('data-metric-group')).toBe(title)
    expect(group.querySelector('h3 > span')?.textContent).toBe(title)
    expect(renderedRows).toEqual(rows)
    expect(group.querySelector('tr[data-metric-row]')?.className).toContain('border-charcoal/15')
  })
  expect(table.className).toContain('min-w-[720px]')
  expect(table.parentElement?.className).toContain('overflow-x-auto')
  expect(rolePills).toHaveLength(6)
  expect(rolePills.map((pill) => pill.textContent)).toEqual([
    'Monetization', 'Economy', 'Economy', 'Feature funnel', 'Feature funnel', 'Feature funnel',
  ])
  rolePills.forEach((pill) => {
    expect(pill.className).toContain('w-28')
    expect(pill.className).toContain('justify-center')
    expect(pill.className).toContain('border')
  })
  expect(rolePills[0].className).toContain('bg-cm-gold/15')
  expect(rolePills[1].className).toContain('bg-cm-sky/20')
  expect(rolePills[3].className).toContain('bg-cm-violet-deep/10')
  expect(groups[0].querySelectorAll('[data-metric-role]')).toHaveLength(0)
  expect(groups[2].querySelectorAll('[data-metric-role]')).toHaveLength(0)
  const groupHeaderRows = groups.map((group) => group.querySelector('tr')!)
  const northStarRow = groups[0].querySelector('tr[data-metric-row]')!
  const northStarTarget = northStarRow.querySelector('[data-metric-target]')!

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
  expect(tooltip.className).toContain('fixed')
  expect(table.parentElement?.contains(tooltip)).toBe(false)
  expect(infoButtons[0].previousElementSibling?.textContent).toBe('Feature funnel')
  expect(metrics.textContent).not.toContain('Decision threshold')
  expect(metrics.textContent).not.toContain('Segmentation')
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
