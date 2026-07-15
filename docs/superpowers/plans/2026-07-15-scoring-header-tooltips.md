# Scoring Header Tooltips Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the four scoring dropdowns with accessible definition-and-rubric tooltips attached to the corresponding Prioritization table headers.

**Architecture:** Render the scoring headers directly from `CRITERIA_DEFS` and place each tooltip inside its header as a CSS hover/focus group. Remove all client state and the separate criteria panel; preserve section-bottom rhythm by transferring the removed block's bottom margin to the scoring-method wrapper.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Jest, Testing Library

## Global Constraints

- Criterion labels, definitions, and 5 / 3 / 1 rubric copy remain unchanged.
- Feature rows, scores, totals, winner styling, scoring paragraphs, and Opportunity Score formula remain unchanged.
- Hovering the criterion header and focusing or tapping its information button reveal the same tooltip.
- Exactly four information buttons render with accessible labels and `aria-describedby` relationships.
- The Effort tooltip aligns to the right edge; the other tooltip panels center beneath their headers.
- The old dropdown buttons, arrow markers, expanded panel, `useState`, and `'use client'` directive are removed.
- Tooltip visibility must not shift table rows or alter the score columns.

## File structure

- Modify `__tests__/ma-homeassignment.test.tsx`: replace the dropdown-specific assertions with tooltip structure, content, accessibility, alignment, and removal assertions.
- Modify `app/MA-HomeAssignment/sections/Prioritization.tsx`: render criterion header tooltips and delete client-state/dropdown code.

---

### Task 1: Replace criterion dropdowns with table-header tooltips

**Files:**
- Test: `__tests__/ma-homeassignment.test.tsx:146-180`
- Modify: `app/MA-HomeAssignment/sections/Prioritization.tsx:5-10,65-70,93-105,137-181`

**Interfaces:**
- Consumes: `CRITERIA_DEFS: { title: string; body: string; rubric: [string, string][] }[]`.
- Produces: four header groups marked by `data-criterion-header`, four `button[aria-describedby]` triggers, and four matching `[role="tooltip"]` panels.

- [ ] **Step 1: Replace the old dropdown regression with a failing tooltip regression**

Replace `it('uses body typography and feature-section bottom spacing for prioritization criteria', ...)` with:

```tsx
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
  const tooltips = Array.from(section.querySelectorAll('[role="tooltip"]'))

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

  expectedCriteria.forEach(({ title, body, rubric }, index) => {
    const header = headers[index]
    const button = infoButtons[index]
    const tooltip = tooltips[index]

    expect(header.getAttribute('data-criterion-header')).toBe(title)
    expect(header.className).toContain('group')
    expect(button.getAttribute('aria-label')).toBe(`About ${title}`)
    expect(button.getAttribute('aria-describedby')).toBe(tooltip.id)
    expect(tooltip.textContent).toContain(body)
    expect(Array.from(tooltip.querySelectorAll('[data-rubric-item]')).map((item) => item.textContent?.replace(/\s/g, ''))).toEqual(
      rubric.map((item) => item.replace(/\s/g, ''))
    )
    expect(tooltip.className).toContain('group-hover:visible')
    expect(tooltip.className).toContain('group-focus-within:visible')
    if (title === 'Effort') expect(tooltip.className).toContain('right-0')
    else expect(tooltip.className).toContain('left-1/2')
  })

  expect(section.querySelectorAll('button[aria-expanded]')).toHaveLength(0)
  expect(section.textContent).not.toContain('▶')
})
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
npm.cmd test -- __tests__\ma-homeassignment.test.tsx --runInBand
```

Expected: FAIL because the current component renders zero `data-criterion-header` groups, zero described information buttons, and zero tooltips, while still rendering four `aria-expanded` dropdown buttons.

- [ ] **Step 3: Remove client-only state and duplicate criterion titles**

Delete:

```tsx
'use client'

import { useState } from 'react'

const CRITERIA = ['ARPDAU Impact', 'Core-Loop Fit', 'Confidence', 'Effort']
```

Inside `Prioritization`, delete:

```tsx
const [open, setOpen] = useState<string | null>(null)
const toggle = (title: string) => setOpen((prev) => (prev === title ? null : title))
const openDef = CRITERIA_DEFS.find((d) => d.title === open)
```

- [ ] **Step 4: Render the tooltip-enabled headers**

Replace the `CRITERIA.map` header block with:

```tsx
{CRITERIA_DEFS.map(({ title, body, rubric }, index) => {
  const tooltipId = `criterion-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-tooltip`
  const align = index === CRITERIA_DEFS.length - 1
    ? 'right-0'
    : 'left-1/2 -translate-x-1/2'

  return (
    <th
      key={title}
      data-criterion-header={title}
      className="group relative font-sans text-[9px] uppercase tracking-[0.12em] text-charcoal/70 py-2 px-3 text-center"
    >
      <span className="inline-flex items-center justify-center gap-1 whitespace-nowrap">
        <span>{title}</span>
        <button
          type="button"
          aria-label={`About ${title}`}
          aria-describedby={tooltipId}
          className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-cm-wood/60 bg-cm-cream font-sans text-[9px] font-bold normal-case tracking-normal text-cm-wood outline-none transition-colors hover:border-cm-crimson hover:text-cm-crimson focus-visible:ring-2 focus-visible:ring-cm-gold focus-visible:ring-offset-1"
        >
          i
        </button>
      </span>
      <div
        id={tooltipId}
        role="tooltip"
        className={`pointer-events-none invisible absolute top-full z-20 mt-2 w-60 rounded-lg border border-cm-wood/35 bg-cm-cream p-3 text-left font-sans normal-case tracking-normal opacity-0 shadow-[0_10px_24px_rgba(42,27,84,0.18)] transition-[opacity,visibility] duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 ${align}`}
      >
        <p className="mb-2 text-[11px] font-normal italic leading-relaxed text-charcoal/80">{body}</p>
        <div className="flex flex-col gap-1 border-t border-charcoal/15 pt-2">
          {rubric.map(([score, description]) => (
            <p key={score} data-rubric-item className="flex gap-1.5 text-[10px] font-normal leading-relaxed text-charcoal/70">
              <span className="font-bold text-cm-crimson">{score}</span>
              <span>{description}</span>
            </p>
          ))}
        </div>
      </div>
    </th>
  )
})}
```

- [ ] **Step 5: Remove the old criteria block and preserve section spacing**

Delete the entire criteria block after the scoring method, from the `{/* Criteria ... */}` comment through its closing wrapper.

Change the scoring-method wrapper from:

```tsx
<div className="max-w-2xl mb-3 flex flex-col gap-3">
```

to:

```tsx
<div className="max-w-2xl mb-6 flex flex-col gap-3">
```

- [ ] **Step 6: Run focused and full verification**

Run:

```powershell
npm.cmd test -- __tests__\ma-homeassignment.test.tsx --runInBand
npm.cmd test -- --runInBand
git diff --check -- __tests__/ma-homeassignment.test.tsx app/MA-HomeAssignment/sections/Prioritization.tsx
```

Expected: both Jest commands PASS and `git diff --check` reports no whitespace errors.

- [ ] **Step 7: Verify the component is server-renderable and inspect localhost**

Run:

```powershell
rg -n "use client|useState|aria-expanded|▶" app/MA-HomeAssignment/sections/Prioritization.tsx
```

Expected: no matches.

Open `http://localhost:3000/MA-HomeAssignment#prioritization` and confirm:

- each criterion header contains an outlined information icon;
- hovering each header reveals the correct tooltip without shifting rows;
- Effort aligns from the right edge;
- keyboard focus reveals the tooltip;
- the former dropdown row is absent;
- the browser console has no errors.

- [ ] **Step 8: Commit the implementation**

```powershell
git add -- __tests__/ma-homeassignment.test.tsx app/MA-HomeAssignment/sections/Prioritization.tsx docs/superpowers/plans/2026-07-15-scoring-header-tooltips.md
git commit -m "feat: add scoring header tooltips"
```

Expected: the commit succeeds on `scoring-hover` with only the test, component, and plan staged.
