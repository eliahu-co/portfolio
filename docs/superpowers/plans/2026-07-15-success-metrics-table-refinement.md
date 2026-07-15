# Success Metrics Table Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify Success Metrics into one table, move the funnel rationale into an accessible info tooltip, and give North Star the animated Core Loop plaque treatment.

**Architecture:** Keep the grouped metric data in `MVP.tsx`, but replace the per-group table component with one `SuccessMetricsTable` renderer. The renderer owns one table header, one row group per metric category, a pure-CSS tooltip, and the North Star plaque styling.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Jest, Testing Library.

## Global Constraints

- Preserve every metric and target exactly.
- Use `#FFC93C` for the North Star fill and `#C77F14` for its edge.
- Reuse `animate-shimmer` and `motion-reduce:animate-none`.
- Preserve the funnel explanation verbatim inside the tooltip.
- Do not modify the prototype or demo.

---

### Task 1: Unified Success Metrics Table

**Files:**
- Modify: `__tests__/ma-homeassignment.test.tsx`
- Modify: `app/MA-HomeAssignment/sections/MVP.tsx`

**Interfaces:**
- Consumes: `METRIC_GROUPS: MetricGroup[]`.
- Produces: `SuccessMetricsTable()` rendering one table with four `<tbody data-metric-group>` row groups.

- [ ] **Step 1: Write the failing unified-table and tooltip assertions**

Update the existing Success Metrics test to assert:

```tsx
expect(metrics.querySelectorAll('table')).toHaveLength(1)
expect(metrics.querySelectorAll('thead')).toHaveLength(1)
expect(Array.from(metrics.querySelectorAll('thead th')).map((cell) => cell.textContent?.trim()))
  .toEqual(['Metric', 'Proposed target'])
expect(metrics.querySelectorAll('[data-metric-group]')).toHaveLength(4)
expect(metrics.querySelectorAll('button[aria-describedby]')).toHaveLength(1)
expect(metrics.querySelector('[role="tooltip"]')?.textContent).toBe(
  'The funnel is coherent: 30% × 65% ≈ 20% activation. The completion range ensures the guarantee provides value without becoming too easy.'
)
```

Also assert the tooltip is not a visible standalone paragraph; its button is labeled `About Feature funnel`; the North Star row group includes `animate-shimmer`, `motion-reduce:animate-none`, `#FFC93C`, and `#C77F14`; and all exact rows remain ordered.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm.cmd test -- --runInBand __tests__/ma-homeassignment.test.tsx`

Expected: FAIL because the current component renders four tables and a visible funnel paragraph.

- [ ] **Step 3: Implement `SuccessMetricsTable`**

Render one fixed-layout table with a single `<thead>`. Map `METRIC_GROUPS` to `<tbody data-metric-group={group.title}>`; add a row-group heading before each group’s metric rows. For Feature funnel, render a 14px outlined info button with `aria-label="About Feature funnel"`, `aria-describedby`, hover/focus tooltip visibility, and the existing note. For North Star, apply the selected full-row yellow treatment and shimmer to its `<tbody>` using:

```tsx
style={{
  backgroundImage: 'linear-gradient(110deg, #FFC93C 0%, #FFC93C 40%, #FFE99A 50%, #FFC93C 60%, #FFC93C 100%)',
  backgroundSize: '200% 100%',
  borderLeft: '4px solid #C77F14',
}}
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm.cmd test -- --runInBand __tests__/ma-homeassignment.test.tsx`

Expected: 14 tests pass.

- [ ] **Step 5: Verify and inspect**

Run: `npm.cmd test -- --runInBand`

Expected: all suites pass.

Run: `npm.cmd run build`

Expected: production build compiles and type-checks.

Inspect the local page and confirm one header, the yellow shine treatment, tooltip hover/focus behavior, no row shift, no overflow, and no console errors.

- [ ] **Step 6: Commit**

```powershell
git add -- __tests__/ma-homeassignment.test.tsx app/MA-HomeAssignment/sections/MVP.tsx
git commit -m "refactor: unify success metrics table"
```
