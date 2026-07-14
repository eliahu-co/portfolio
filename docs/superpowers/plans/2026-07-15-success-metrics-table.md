# Success Metrics Table Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the approved prototype asset/button update and replace the MVP metric cards with the approved editorial ruled table.

**Architecture:** `PrototypePreview` keeps its current link and visual structure while switching to the user-provided WebP and a shorter visible label. `MVP` replaces card-oriented metric data with semantic table rows and renders them using the same restrained rules and typography as the prioritization table.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Jest, Testing Library

## Global Constraints

- Preserve the prototype link, play icon, accessible link label, and visual styling.
- Use the exact eight metric, role, and target values from the approved spec.
- Preserve the Success metrics introduction and `max-w-3xl` container.
- Use a semantic table with the approved editorial ruled treatment and horizontal overflow on narrow screens.
- Make no unrelated content or layout changes.

---

### Task 1: Finish prototype WebP and button label

**Files:**
- Modify: `__tests__/ma-homeassignment.test.tsx:41-48,84-103`
- Modify: `app/MA-HomeAssignment/sections/PrototypePreview.tsx:18,37`
- Modify: `docs/superpowers/plans/2026-07-15-mvp-prototype-placement.md:51`
- Delete: `public/coinmaster/prototype.png`
- Create: `public/coinmaster/prototype.webp`

**Interfaces:**
- Consumes: the existing `/MA-HomeAssignment/demo` preview link.
- Produces: a loaded `/coinmaster/prototype.webp` image and a play-icon button whose visible label is exactly `Open`.

- [x] **Step 1: Add the failing button-label assertion**

In the existing prototype integration test, add:

```ts
const previewLink = prototype.querySelector('a[href="/MA-HomeAssignment/demo"]')!
const buttonLabel = previewLink.querySelector('span')!
expect(buttonLabel.textContent?.trim()).toBe('Open')
expect(buttonLabel.querySelector('svg')).not.toBeNull()
expect(previewLink.getAttribute('aria-label')).toBe('Open the Card Bounty interactive prototype')
```

The already-edited image assertions must continue to require `/coinmaster/prototype.webp`.

- [x] **Step 2: Run the focused test and verify RED**

Run:

```powershell
npm.cmd test -- __tests__\ma-homeassignment.test.tsx --runInBand
```

Expected: FAIL because the visible label remains `Open interactive prototype`.

- [x] **Step 3: Shorten the visible label**

In `PrototypePreview.tsx`, keep the SVG and replace only the trailing text:

```tsx
Open
```

- [x] **Step 4: Run the focused test and verify GREEN**

Run:

```powershell
npm.cmd test -- __tests__\ma-homeassignment.test.tsx --runInBand
```

Expected: all focused tests pass.

### Task 2: Replace metric cards with the editorial table

**Files:**
- Modify: `__tests__/ma-homeassignment.test.tsx`
- Modify: `app/MA-HomeAssignment/sections/MVP.tsx:6,35-89,145-169`

**Interfaces:**
- Consumes: the existing Success metrics introduction and container.
- Produces: one semantic three-column table with eight ordered metric rows.

- [x] **Step 1: Add the failing table regression test**

Add a test that renders the page, finds the `Success metrics` heading and its parent, then asserts these headers and rows:

```ts
const expectedRows = [
  ['ARPDAU', 'Primary', '+5% or more during the event'],
  ['Chest Coin Spend per DAU', 'Economy', '+10% or more'],
  ['Total Coin Consumption per DAU', 'Economy', '+5% or more, confirming incremental Coin demand'],
  ['Bounty Activation Rate', 'Adoption', '20% or more of eligible daily active players select a target and open at least one Coin-purchased Chest'],
  ['Post-Event Revenue per Player', 'Guardrail', 'Stable or higher: at least 98% of control during the following seven days'],
  ['Post-Event Chest Coin Spend per Player', 'Guardrail', 'Stable or higher: at least 95% of control during the following seven days'],
  ['Card Collections Completed per Player', 'Guardrail', 'No more than 15% above control across the event and following seven days'],
  ['Village Upgrades per Player', 'Guardrail', 'Stable or higher: at least 95% of control across the event and following seven days'],
]

it('renders the approved editorial success metrics table', () => {
  render(<MAHomeAssignmentPage />)
  const mvp = document.getElementById('mvp')!
  const heading = Array.from(mvp.querySelectorAll('h2')).find(
    (node) => node.textContent === 'Success metrics'
  )!
  const metrics = heading.parentElement!
  const table = metrics.querySelector('table')!
  const headers = Array.from(table.querySelectorAll('th')).map((cell) => cell.textContent?.trim())
  const rows = Array.from(table.querySelectorAll('tbody tr')).map((row) =>
    Array.from(row.querySelectorAll('td')).map((cell) => cell.textContent?.trim())
  )

  expect(headers).toEqual(['Metric', 'Role', 'Proposed target'])
  expect(rows).toEqual(expectedRows)
  expect(table.className).toContain('min-w-[720px]')
  expect(table.parentElement?.className).toContain('overflow-x-auto')
  expect(table.querySelector('thead tr')?.className).toContain('border-cm-wood')
  expect(table.querySelector('tbody tr')?.className).toContain('border-charcoal/15')
  expect(metrics.textContent).not.toContain('Success signal')
  expect(metrics.querySelectorAll('div.border-l-4')).toHaveLength(0)
})
```

- [x] **Step 2: Run the focused test and verify RED**

Run:

```powershell
npm.cmd test -- __tests__\ma-homeassignment.test.tsx --runInBand
```

Expected: FAIL because the Success metrics block has no table.

- [x] **Step 3: Replace metric data with exact table rows**

Remove the `Pill` import. Replace `METRICS` with:

```ts
type MetricRole = 'Primary' | 'Economy' | 'Adoption' | 'Guardrail'

const METRICS: { metric: string; role: MetricRole; target: string }[] = [
  { metric: 'ARPDAU', role: 'Primary', target: '+5% or more during the event' },
  { metric: 'Chest Coin Spend per DAU', role: 'Economy', target: '+10% or more' },
  { metric: 'Total Coin Consumption per DAU', role: 'Economy', target: '+5% or more, confirming incremental Coin demand' },
  { metric: 'Bounty Activation Rate', role: 'Adoption', target: '20% or more of eligible daily active players select a target and open at least one Coin-purchased Chest' },
  { metric: 'Post-Event Revenue per Player', role: 'Guardrail', target: 'Stable or higher: at least 98% of control during the following seven days' },
  { metric: 'Post-Event Chest Coin Spend per Player', role: 'Guardrail', target: 'Stable or higher: at least 95% of control during the following seven days' },
  { metric: 'Card Collections Completed per Player', role: 'Guardrail', target: 'No more than 15% above control across the event and following seven days' },
  { metric: 'Village Upgrades per Player', role: 'Guardrail', target: 'Stable or higher: at least 95% of control across the event and following seven days' },
]

const ROLE_CLASSES: Record<MetricRole, string> = {
  Primary: 'bg-cm-gold/15 text-cm-wood',
  Economy: 'bg-cm-violet-deep/10 text-cm-violet-deep',
  Adoption: 'bg-cm-violet-deep/10 text-cm-violet-deep',
  Guardrail: 'bg-cm-crimson/10 text-cm-crimson',
}
```

- [x] **Step 4: Render the editorial table**

Replace the metric-card container with:

```tsx
<div className="overflow-x-auto">
  <table className="w-full min-w-[720px] border-collapse text-left">
    <thead>
      <tr className="border-b-2 border-cm-wood">
        <th className="w-[30%] py-2 pr-4 font-sans text-[9px] uppercase tracking-[0.12em] text-charcoal/70">Metric</th>
        <th className="w-[16%] px-3 py-2 font-sans text-[9px] uppercase tracking-[0.12em] text-charcoal/70">Role</th>
        <th className="py-2 pl-3 font-sans text-[9px] uppercase tracking-[0.12em] text-charcoal/70">Proposed target</th>
      </tr>
    </thead>
    <tbody>
      {METRICS.map(({ metric, role, target }) => (
        <tr key={metric} className="border-b border-charcoal/15">
          <td className="py-3 pr-4 align-top font-sans text-[13px] font-medium leading-relaxed text-cm-violet-deep">{metric}</td>
          <td className="px-3 py-3 align-top">
            <span className={`inline-flex rounded-full px-2 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.08em] ${ROLE_CLASSES[role]}`}>{role}</span>
          </td>
          <td className="py-3 pl-3 align-top font-sans text-[13px] leading-relaxed text-charcoal">{target}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

- [x] **Step 5: Run focused and full verification**

Run:

```powershell
npm.cmd test -- __tests__\ma-homeassignment.test.tsx --runInBand
npm.cmd test -- --runInBand
```

Expected: focused and full suites pass with no failures.

- [x] **Step 6: Verify localhost and commit**

Open `http://localhost:3000/MA-HomeAssignment?finetuning=7#mvp`. Confirm the WebP loads, the button shows play icon + `Open`, the table matches Option A, all rows are readable, and there are no console errors.

```powershell
git add __tests__/ma-homeassignment.test.tsx app/MA-HomeAssignment/sections/PrototypePreview.tsx app/MA-HomeAssignment/sections/MVP.tsx docs/superpowers/plans/2026-07-15-mvp-prototype-placement.md docs/superpowers/plans/2026-07-15-success-metrics-table.md public/coinmaster/prototype.png public/coinmaster/prototype.webp
git commit -m "feat(ma-homeassignment): add success metrics table"
```

### Task 3: Refine role pills and metrics introduction

**Files:**
- Modify: `__tests__/ma-homeassignment.test.tsx`
- Modify: `app/MA-HomeAssignment/sections/MVP.tsx`

**Interfaces:**
- Consumes: the semantic metrics table and `ROLE_CLASSES` mapping from Task 2.
- Produces: one-pixel role-pill borders, a visually blank Role header with an accessible label, and the approved introduction copy.

- [ ] **Step 1: Update the regression test first**

In the existing metrics table test, add:

```ts
const introduction = Array.from(metrics.querySelectorAll('p')).find((node) =>
  node.textContent?.startsWith('Eligible players')
)!
const roleHeader = table.querySelectorAll('th')[1]
const rolePills = Array.from(table.querySelectorAll('tbody td:nth-child(2) span'))

expect(introduction.textContent).toBe(
  'Eligible players have the Cards Center unlocked and at least one targetable missing Card. Event metrics use eligible players active each day; post event guardrails use the full eligible group. All results compare treatment with control.'
)
expect(roleHeader.querySelector('.sr-only')?.textContent).toBe('Role')
expect(roleHeader.childNodes).toHaveLength(1)
expect(rolePills).toHaveLength(8)
for (const pill of rolePills) expect(pill.className).toContain('border')
expect(rolePills[0].className).toContain('border-cm-wood/50')
expect(rolePills[1].className).toContain('border-cm-violet-deep/30')
expect(rolePills[3].className).toContain('border-cm-violet-deep/30')
expect(rolePills[4].className).toContain('border-cm-crimson/30')
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
npm.cmd test -- __tests__\ma-homeassignment.test.tsx --runInBand
```

Expected: FAIL because the old introduction, visible Role header, and borderless pills remain.

- [ ] **Step 3: Apply the minimal refinements**

Change the role mapping to:

```ts
const ROLE_CLASSES: Record<MetricRole, string> = {
  Primary: 'border-cm-wood/50 bg-cm-gold/15 text-cm-wood',
  Economy: 'border-cm-violet-deep/30 bg-cm-violet-deep/10 text-cm-violet-deep',
  Adoption: 'border-cm-violet-deep/30 bg-cm-violet-deep/10 text-cm-violet-deep',
  Guardrail: 'border-cm-crimson/30 bg-cm-crimson/10 text-cm-crimson',
}
```

Add `border` to the shared role-pill classes. Replace the Role header content with:

```tsx
<span className="sr-only">Role</span>
```

Replace the introductory paragraph text with:

```tsx
Eligible players have the Cards Center unlocked and at least one targetable missing Card. Event
metrics use eligible players active each day; post event guardrails use the full eligible group. All
results compare treatment with control.
```

- [ ] **Step 4: Run focused/full tests, verify localhost, and commit**

Run:

```powershell
npm.cmd test -- __tests__\ma-homeassignment.test.tsx --runInBand
npm.cmd test -- --runInBand
```

Open `http://localhost:3000/MA-HomeAssignment?finetuning=9#mvp`. Confirm the Role header is visually absent, each pill has its coherent one-pixel stroke, the paragraph wraps responsively, and the console is clean.

```powershell
git add __tests__/ma-homeassignment.test.tsx app/MA-HomeAssignment/sections/MVP.tsx docs/superpowers/plans/2026-07-15-success-metrics-table.md
git commit -m "style(ma-homeassignment): refine success metrics table"
```
