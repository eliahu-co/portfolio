# Feature Validation Experiment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move Success Metrics into a standalone Feature Validation chapter that defines the experiment and presents primary, supporting, and guardrail metrics in the approved pill-based table.

**Architecture:** Keep `MVP.tsx` focused on the expanded feature, scope, and prototype. Add a dedicated `FeatureValidation.tsx` component that owns protocol copy, metric data, pill styling, the contained North Star shimmer, and the portal-based Feature funnel tooltip; wire it into the page and shared side navigation.

**Tech Stack:** Next.js 14, React, TypeScript, Tailwind CSS, Jest, React Testing Library.

## Global Constraints

- Branch is `experiment`; do not touch demo code.
- The new section anchor is `validation`, immediately after the prototype-bearing MVP section and before Assumptions.
- Eyebrow is `Validation`; title is `Feature Validation`.
- Do not render `Success metrics`, `Segmentation`, or `Decision threshold`.
- Protocol uses plain label-and-body blocks with no card surface.
- Supporting role pills are equal-width, centered, bordered `Monetization`, `Economy`, and `Feature funnel` pills.
- Guardrail rows have no role pill.
- Preserve the current proposed targets and Feature funnel explanation.
- Never create page-level horizontal overflow.

---

### Task 1: Extract the validation chapter and update presentation navigation

**Files:**
- Create: `app/MA-HomeAssignment/sections/FeatureValidation.tsx`
- Modify: `app/MA-HomeAssignment/sections/MVP.tsx`
- Modify: `app/MA-HomeAssignment/page.tsx`
- Modify: `app/MA-HomeAssignment/sections.ts`
- Test: `__tests__/ma-homeassignment.test.tsx`

**Interfaces:**
- Consumes: shared `Section` component with `{ id, eyebrow, title, children }`.
- Produces: default React component `FeatureValidation` rendering `section#validation`.

- [ ] **Step 1: Write the failing structure and copy tests**

Replace the prototype test’s Success Metrics ordering assertion and add a focused validation test:

```tsx
it('places the standalone Feature Validation chapter after the prototype', () => {
  render(<MAHomeAssignmentPage />)
  const mvp = document.getElementById('mvp')!
  const prototype = document.getElementById('prototype')!
  const validation = document.getElementById('validation')!

  expect(mvp.contains(prototype)).toBe(true)
  expect(mvp.contains(validation)).toBe(false)
  expect(prototype.compareDocumentPosition(validation) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  expect(validation.querySelector('p')?.textContent).toBe('Validation')
  expect(validation.querySelector('h2')?.textContent).toBe('Feature Validation')
  expect(SECTIONS.map(({ id, label }) => [id, label])).toContainEqual(['validation', 'Validation'])
})

it('renders the approved experiment protocol without removed copy', () => {
  render(<MAHomeAssignmentPage />)
  const validation = document.getElementById('validation')!
  const expected = [
    ['Population', 'Players with the Cards Center unlocked and at least one eligible missing Card.'],
    ['Control', 'Existing Cards Center without Card Bounty.'],
    ['Treatment', 'Existing Cards Center with Card Bounty as a time-limited LiveOps event.'],
    ['Hypothesis', 'A visible guarantee for a chosen missing Card increases Coin-purchased Chest openings. Higher Coin consumption increases demand for existing Spin and Coin offers, lifting ARPDAU.'],
  ]

  expected.forEach(([label, body]) => {
    const labelNode = Array.from(validation.querySelectorAll('p')).find((node) => node.textContent === label)!
    expect(labelNode.className).toContain('font-extrabold')
    expect(labelNode.className).toContain('tracking-[0.14em]')
    expect(labelNode.nextElementSibling?.textContent).toBe(body)
    expect(labelNode.parentElement?.className).not.toContain('border')
    expect(labelNode.parentElement?.className).not.toContain('bg-')
  })
  expect(validation.textContent).not.toContain('Segmentation')
  expect(validation.textContent).not.toContain('Decision threshold')
  expect(document.body.textContent).not.toContain('Success metrics')
})
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```powershell
npm.cmd test -- --runInBand __tests__/ma-homeassignment.test.tsx
```

Expected: FAIL because `#validation`, `FeatureValidation`, and the navigation entry do not exist and Success Metrics is still inside MVP.

- [ ] **Step 3: Implement the section boundary and protocol**

Create `FeatureValidation.tsx` with:

```tsx
import Section from './Section'

const PROTOCOL = [
  { label: 'Population', body: 'Players with the Cards Center unlocked and at least one eligible missing Card.' },
  { label: 'Control', body: 'Existing Cards Center without Card Bounty.' },
  { label: 'Treatment', body: 'Existing Cards Center with Card Bounty as a time-limited LiveOps event.' },
  { label: 'Hypothesis', body: 'A visible guarantee for a chosen missing Card increases Coin-purchased Chest openings. Higher Coin consumption increases demand for existing Spin and Coin offers, lifting ARPDAU.' },
]

export default function FeatureValidation() {
  return (
    <Section id="validation" eyebrow="Validation" title="Feature Validation">
      <div className="mb-8 max-w-2xl space-y-5">
        {PROTOCOL.map(({ label, body }) => (
          <div key={label}>
            <p className="font-sans text-[10px] font-extrabold uppercase tracking-[0.14em] text-black mb-3">{label}</p>
            <p className="font-sans text-[14px] leading-relaxed text-charcoal">{body}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
```

Move `METRIC_GROUPS`, `Metric`, `MetricGroup`, and `SuccessMetricsTable` out of `MVP.tsx` into the new component in Task 2. Delete the Success Metrics block from `MVP`. Import and render `<FeatureValidation />` after `<MVP />` in `page.tsx`. Insert `{ id: 'validation', label: 'Validation' }` after the Prototype entry in `sections.ts`.

- [ ] **Step 4: Run the focused tests and verify GREEN**

Run the same focused test command. Expected: the new structure and protocol tests pass; the old grouped-table test may still fail until Task 2 replaces it.

- [ ] **Step 5: Commit the chapter extraction**

```powershell
git add -- __tests__/ma-homeassignment.test.tsx app/MA-HomeAssignment/sections/FeatureValidation.tsx app/MA-HomeAssignment/sections/MVP.tsx app/MA-HomeAssignment/page.tsx app/MA-HomeAssignment/sections.ts
git commit -m "feat: add feature validation chapter"
```

### Task 2: Rebuild metrics as the approved experiment table

**Files:**
- Modify: `app/MA-HomeAssignment/sections/FeatureValidation.tsx`
- Test: `__tests__/ma-homeassignment.test.tsx`

**Interfaces:**
- Consumes: `FeatureValidation` chapter created in Task 1.
- Produces: `ValidationMetric` data with optional `role: 'Monetization' | 'Economy' | 'Feature funnel'`, grouped table bodies, and an accessible tooltip for the first Feature funnel role.

- [ ] **Step 1: Replace the old grouped-table test with failing experiment-table assertions**

Use these exact expectations:

```tsx
const expectedGroups = [
  { title: 'Primary metric', rows: [['ARPDAU', '', '≥5% lift']] },
  { title: 'Supporting metrics', rows: [
    ['ARPPU by payer tier', 'Monetization', '≥5% lift overall and ≥8% among the high-spender cohort'],
    ['Coin spend on Chests per DAU', 'Economy', '≥10% lift'],
    ['Total Coin Consumption per DAU', 'Economy', '≥5% lift'],
    ['Target Selection Rate', 'Feature funnel', '≥30% of eligible DAU'],
    ['First-Chest Conversion', 'Feature funnel', '≥65% of players who select a target'],
    ['Bounty Completion Rate', 'Feature funnel', '10–20% of activated players'],
  ] },
  { title: 'Guardrails', rows: [
    ['Card Collections Completed per Player', '', '≤115%'],
    ['Village Upgrades per Player', '', '≥95%'],
    ['Post-Event Coin Spend on Chests per Player', '', '≥95%'],
    ['Post-Event Revenue per Player', '', '≥98%'],
  ] },
]
```

Assert one table, header text `['Metric', 'Role', 'Proposed target']` with the Role header carrying `sr-only`, three `tbody[data-metric-group]` elements, six role pills total only where roles exist, equal pill width class, correct color classes, no Guardrail pills, shimmer only on ARPDAU, and one tooltip button after the Target Selection Rate Feature funnel pill.

- [ ] **Step 2: Run the focused test and verify RED**

```powershell
npm.cmd test -- --runInBand __tests__/ma-homeassignment.test.tsx
```

Expected: FAIL on old two-column grouped table, old group names, and missing pills.

- [ ] **Step 3: Implement metric data, role pills, and tooltip**

Define:

```tsx
type MetricRole = 'Monetization' | 'Economy' | 'Feature funnel'
type ValidationMetric = { metric: string; target: string; role?: MetricRole; funnelHelp?: boolean }
type ValidationGroup = { title: 'Primary metric' | 'Supporting metrics' | 'Guardrails'; metrics: ValidationMetric[]; emphasis?: 'north-star' }

const ROLE_CLASSES: Record<MetricRole, string> = {
  Monetization: 'border-cm-wood/50 bg-cm-gold/15 text-cm-wood',
  Economy: 'border-[#0F3D54]/40 bg-cm-sky/20 text-[#0F3D54]',
  'Feature funnel': 'border-cm-violet-deep/30 bg-cm-violet-deep/10 text-cm-violet-deep',
}
```

Render a three-column table with widths `30%`, `w-[132px]`, and the remaining target width. The role header contains `<span className="sr-only">Role</span>`. Role pills use `inline-flex w-28 justify-center rounded-full border px-2 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.08em]`. Empty role cells remain in Primary and Guardrail rows to preserve alignment.

Reuse the current ARPDAU row shimmer exactly. Keep the group header divider classes: Primary uses `border-cm-wood`; Supporting and Guardrails use `border-charcoal/25`.

On Target Selection Rate only, place the existing 14px information button after the Feature funnel pill. Render the tooltip via `createPortal(..., document.body)` with fixed positioning derived from the button rectangle, the existing explanatory copy, hover/focus visibility, and no containment inside the table scroller.

- [ ] **Step 4: Run focused and full verification**

```powershell
npm.cmd test -- --runInBand __tests__/ma-homeassignment.test.tsx
npm.cmd test -- --runInBand
npm.cmd run build
```

Expected: assignment tests pass, all 23 suites pass, and Next.js production build exits 0.

- [ ] **Step 5: Visually verify localhost**

At `http://localhost:3000/MA-HomeAssignment`, verify desktop and mobile widths: Validation follows Prototype, side navigation activates Validation, labels have no cards, all pills are equal width, Guardrails have no pills, the tooltip renders outside the scrolling table, shimmer is contained to ARPDAU, and the page has no horizontal overflow or console errors.

- [ ] **Step 6: Commit the experiment table**

```powershell
git add -- __tests__/ma-homeassignment.test.tsx app/MA-HomeAssignment/sections/FeatureValidation.tsx
git commit -m "feat: restructure success metrics as experiment"
```
