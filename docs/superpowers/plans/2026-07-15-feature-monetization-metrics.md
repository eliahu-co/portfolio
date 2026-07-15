# Feature Monetization Strategy and Metrics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace each feature's KPI block with stacked Monetization Strategy and Metrics blocks that use exact feature-specific copy and preserve the existing visual language.

**Architecture:** Extend `UseCaseData` with explicit `monetizationStrategy` and `metrics` fields, then render both through small focused helpers in the existing responsive business-case position. Preserve the current starred primary metric and diamond-bulleted supporting metrics, while adding stable layout attributes for regression checks across the duplicated mobile and desktop render paths.

**Tech Stack:** Next.js 14, React, TypeScript, Tailwind CSS, Jest, Testing Library

## Global Constraints

- The visible label is `METRICS`, never `KPI`.
- `MONETIZATION STRATEGY` appears before `METRICS`, and both appear before `LOOP`.
- Strategy lead phrases are bold inline; the remaining strategy copy is regular 14px charcoal body text.
- ARPDAU is the starred North Star for all three features.
- Supporting metrics retain the existing small gold diamond bullets and remain separate list items.
- Mobile keeps both business-case blocks full-width above the Loop/mockup row; desktop keeps them in the left column above Loop.
- Do not add cards, backgrounds, borders, animations, colors, or assets.
- Do not change MVP Success Metrics, prioritization, Loop, Concept, Value Delivered, Risks, mockups, or the interactive prototype.

---

### Task 1: Replace feature KPIs with monetization strategy and metrics

**Files:**
- Modify: `__tests__/ma-homeassignment.test.tsx`
- Modify: `app/MA-HomeAssignment/sections/UseCase.tsx`
- Modify: `app/MA-HomeAssignment/sections/useCaseData.ts`

**Interfaces:**
- Consumes: `UseCaseData` feature content rendered by `UseCase`.
- Produces: `monetizationStrategy?: { lead: string; body: string }`, `metrics?: { primary: string; supporting: string[] }`, `MonetizationStrategy`, and `MetricsList`.
- Produces: responsive wrappers marked `data-feature-business-case="mobile"` and `data-feature-business-case="desktop"` for stable hierarchy verification.

- [ ] **Step 1: Write failing data and rendering regression tests**

Change the data import to:

```tsx
import { USE_CASE_1, USE_CASE_2, USE_CASE_3 } from '@/app/MA-HomeAssignment/sections/useCaseData'
```

Add these tests:

```tsx
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
      strategy: {
        lead: 'Conversion and purchase frequency.',
        body: 'Targets high-progression, socially engaged players with a persistent Coin sink and new customization offers.',
      },
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
      strategy: {
        lead: 'Spend depth.',
        body: 'Weighted toward high-intent collectors and high spenders. Repeated Chest openings consume Coins and increase demand for existing Spin and Coin offers.',
      },
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
      strategy: {
        lead: 'Purchase frequency through re-engagement.',
        body: 'Targets recently Raided players with an urgent return session that consumes Spins and creates another opportunity to purchase.',
      },
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
      const labels = Array.from(businessCase.querySelectorAll(':scope > div > p:first-child')).map(
        (node) => node.textContent
      )
      const strategyBlock = businessCase.children[0]
      const metricsBlock = businessCase.children[1]
      const strategyParagraph = strategyBlock.querySelector('p:not(:first-child)')!
      const metricItems = Array.from(metricsBlock.querySelectorAll('li'))

      expect(labels).toEqual(['Monetization Strategy', 'Metrics'])
      expect(strategyParagraph.querySelector('strong')?.textContent).toBe(data.monetizationStrategy?.lead)
      expect(strategyParagraph.textContent).toBe(
        `${data.monetizationStrategy?.lead} ${data.monetizationStrategy?.body}`
      )
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
```

- [ ] **Step 2: Run the new tests to verify they fail**

Run:

```powershell
npm.cmd test -- --runInBand __tests__/ma-homeassignment.test.tsx -t "approved monetization strategy|renders monetization strategy before metrics"
```

Expected: FAIL because `monetizationStrategy`, `metrics`, and the responsive business-case markers do not exist yet.

- [ ] **Step 3: Replace the KPI data interface and renderer**

In `UseCaseData`, replace `kpi` with:

```ts
monetizationStrategy?: {
  lead: string
  body: string
}
metrics?: {
  primary: string
  supporting: string[]
}
```

Replace `KpiList` with these helpers while retaining the existing list classes and glyph styling:

```tsx
function MonetizationStrategy({ strategy }: { strategy: { lead: string; body: string } }) {
  return (
    <p className="font-sans text-[14px] leading-relaxed text-charcoal">
      <strong className="font-bold">{strategy.lead}</strong>{' '}
      {strategy.body}
    </p>
  )
}

function MetricsList({ metrics }: { metrics: { primary: string; supporting: string[] } }) {
  return (
    <ul className="flex flex-col gap-1.5">
      <li className="font-sans text-[14px] leading-relaxed text-charcoal flex items-center gap-2">
        <span className="shrink-0 leading-none text-cm-gold" aria-hidden="true">★</span>
        <span>{metrics.primary}</span>
      </li>
      {metrics.supporting.map((metric, index) => (
        <li key={index} className="font-sans text-[14px] leading-relaxed text-charcoal flex gap-2">
          <span className="shrink-0 mt-[3px] text-[8px] text-cm-gold/70" aria-hidden="true">◆</span>
          <span>{metric}</span>
        </li>
      ))}
    </ul>
  )
}
```

Replace the KPI block construction with:

```tsx
const strategyBlock = data.monetizationStrategy ? (
  <Block label="Monetization Strategy">
    <MonetizationStrategy strategy={data.monetizationStrategy} />
  </Block>
) : null

const metricsBlock = data.metrics ? (
  <Block label="Metrics">
    <MetricsList metrics={data.metrics} />
  </Block>
) : data.arpdauMechanism ? (
  <Block label={data.mechanismLabel ?? 'ARPDAU Mechanism'}>
    <p className="font-sans text-[14px] leading-relaxed text-charcoal whitespace-pre-line">{data.arpdauMechanism}</p>
  </Block>
) : null

const businessCaseBlocks = strategyBlock || metricsBlock ? (
  <>
    {strategyBlock}
    {metricsBlock}
  </>
) : null
```

Render it in both existing responsive positions:

```tsx
{businessCaseBlocks && (
  <div data-feature-business-case="mobile" className="md:hidden">
    {businessCaseBlocks}
  </div>
)}
```

```tsx
{businessCaseBlocks && (
  <div data-feature-business-case="desktop" className="hidden md:block">
    {businessCaseBlocks}
  </div>
)}
```

Update nearby comments from KPI terminology to business-case/metrics terminology.

- [ ] **Step 4: Replace each feature's KPI data with exact approved content**

For Hometown, use:

```ts
monetizationStrategy: {
  lead: 'Conversion and purchase frequency.',
  body: 'Targets high-progression, socially engaged players with a persistent Coin sink and new customization offers.',
},
metrics: {
  primary: 'ARPDAU',
  supporting: [
    'Coin spend on Hometown per DAU',
    'Repeat customization',
    'Return sessions per Hometown user',
  ],
},
```

For Card Bounty, use:

```ts
monetizationStrategy: {
  lead: 'Spend depth.',
  body: 'Weighted toward high-intent collectors and high spenders. Repeated Chest openings consume Coins and increase demand for existing Spin and Coin offers.',
},
metrics: {
  primary: 'ARPDAU',
  supporting: [
    'ARPPU by payer tier',
    'Coin Spend on Chests per DAU',
    'Bounty activation',
  ],
},
```

For Hot Trail, use:

```ts
monetizationStrategy: {
  lead: 'Purchase frequency through re-engagement.',
  body: 'Targets recently Raided players with an urgent return session that consumes Spins and creates another opportunity to purchase.',
},
metrics: {
  primary: 'ARPDAU',
  supporting: [
    'Hot Trail activation',
    'Return rate',
    'Spin consumption per exposed DAU',
  ],
},
```

- [ ] **Step 5: Run focused and full automated verification**

Run:

```powershell
npm.cmd test -- --runInBand __tests__/ma-homeassignment.test.tsx
npm.cmd test -- --runInBand
```

Expected: The assignment suite and all repository test suites pass.

Before building, move only the ignored generated `.next` cache to a validated temp path because OneDrive marks its files as reparse points:

```powershell
$workspace = (Resolve-Path -LiteralPath '.').Path
if (Test-Path -LiteralPath '.next') {
  $source = (Resolve-Path -LiteralPath '.next').Path
  $tempRoot = [IO.Path]::GetFullPath([IO.Path]::GetTempPath())
  $destination = Join-Path $tempRoot ('portfolio-next-stale-' + [DateTime]::Now.ToString('yyyyMMdd-HHmmss'))
  if (-not $source.StartsWith($workspace, [StringComparison]::OrdinalIgnoreCase)) { throw "Source escaped workspace: $source" }
  if (-not ([IO.Path]::GetFullPath($destination)).StartsWith($tempRoot, [StringComparison]::OrdinalIgnoreCase)) { throw "Destination escaped temp: $destination" }
  Move-Item -LiteralPath $source -Destination $destination
}
npm.cmd run build
git diff --check
```

Expected: The production build exits successfully and `git diff --check` reports no whitespace errors.

- [ ] **Step 6: Visually verify desktop and mobile layouts**

Use the browser preview to inspect `/MA-HomeAssignment` at a desktop width and a mobile width. For Hometown, Card Bounty, and Hot Trail, verify:

- Monetization Strategy is directly above Metrics.
- Metrics is directly above Loop.
- Strategy lead text is bold inline without changing paragraph size or color.
- ARPDAU retains the gold star and each supporting metric retains the small gold diamond.
- No block overlaps, clips, or introduces horizontal overflow.
- The mockups, Loop, Value Delivered, and Risks remain unchanged.

- [ ] **Step 7: Commit the implementation**

```powershell
git add __tests__/ma-homeassignment.test.tsx app/MA-HomeAssignment/sections/UseCase.tsx app/MA-HomeAssignment/sections/useCaseData.ts
git commit -m "feat: add feature monetization strategies and metrics"
```
