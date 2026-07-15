# Success Metrics Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat role-pill success metrics table with four responsive, stacked two-column metric groups and a contextual funnel note.

**Architecture:** Keep the feature local to `MVP.tsx`. Represent each group as typed data and render it through one local `MetricGroupTable` component so headings, column proportions, typography, and spacing remain consistent.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Jest, Testing Library.

## Global Constraints

- Preserve the existing eligibility/control explanatory paragraph verbatim.
- Use “Coin spend on Chests per DAU,” not “Chest Coin Spend per DAU.”
- Do not modify the interactive prototype or demo.
- Tables must wrap without horizontal scrolling on narrow screens.

---

### Task 1: Grouped Success Metrics

**Files:**
- Modify: `__tests__/ma-homeassignment.test.tsx`
- Modify: `app/MA-HomeAssignment/sections/MVP.tsx`

**Interfaces:**
- Consumes: the existing `MVP` section and `SubHeading` component.
- Produces: a local `MetricGroup` type, `METRIC_GROUPS` data, and `MetricGroupTable({ group })` renderer.

- [ ] **Step 1: Replace the flat-table expectations with a failing grouped-table test**

Assert the four group headings in order; the exact eleven metric/target pairs; two headers per table; no role pills or Role header; the exact funnel note; no `min-w-[720px]`; and no horizontal overflow wrapper.

```tsx
const expectedGroups = [
  ['North Star', [['ARPDAU', '≥5% lift']]],
  ['Monetization and economy drivers', [
    ['ARPPU', '≥5% lift overall and ≥8% among the high-spender cohort'],
    ['Coin spend on Chests per DAU', '≥10% lift'],
    ['Total Coin Consumption per DAU', '≥5% lift'],
  ]],
  ['Feature funnel', [
    ['Target Selection Rate', '≥30% of eligible DAU'],
    ['First-Chest Conversion', '≥65% of players who select a target'],
    ['Bounty Completion Rate', '10–20% of activated players'],
  ]],
  ['Guardrails', [
    ['Post-Event Revenue per Player', '≥98%'],
    ['Post-Event Chest Coin Spend per Player', '≥95%'],
    ['Card Collections Completed per Player', '≤115%'],
    ['Village Upgrades per Player', '≥95%'],
  ]],
]
```

- [ ] **Step 2: Run the focused test and confirm the expected failure**

Run: `npm.cmd test -- --runInBand __tests__/ma-homeassignment.test.tsx`

Expected: FAIL because the current page has one three-column table, role pills, and the old metrics/copy.

- [ ] **Step 3: Implement the grouped data and reusable table**

Replace `MetricRole`, `METRICS`, and `ROLE_CLASSES` with:

```tsx
type Metric = { metric: string; target: string }
type MetricGroup = {
  title: string
  metrics: Metric[]
  emphasis?: 'north-star'
  note?: string
}
```

Populate `METRIC_GROUPS` with the exact approved content. Render each group with a two-column table (`42%` metric / remaining target), shared compact uppercase headers, fine row rules, and natural text wrapping. Use a subtle gold left rule/wash for `north-star`; use a gold left-rule note under Feature funnel. Do not use `overflow-x-auto` or a fixed minimum width.

- [ ] **Step 4: Run the focused test and confirm it passes**

Run: `npm.cmd test -- --runInBand __tests__/ma-homeassignment.test.tsx`

Expected: 14 tests pass.

- [ ] **Step 5: Verify behavior and presentation**

Run: `npm.cmd test -- --runInBand`

Expected: all suites and tests pass.

Run: `npm.cmd run build`

Expected: optimized production build compiles and type-checks successfully.

Inspect `/MA-HomeAssignment#mvp` at desktop and narrow viewport widths. Confirm hierarchy, wrapping, spacing, no horizontal scrollbar, and no console errors.

- [ ] **Step 6: Commit**

```powershell
git add -- __tests__/ma-homeassignment.test.tsx app/MA-HomeAssignment/sections/MVP.tsx
git commit -m "feat: restructure success metrics"
```
