# Success Metrics Group Dividers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put the table dividers beneath each metric-group heading and contain the North Star shimmer to the ARPDAU row.

**Architecture:** Preserve the unified semantic table and its four `<tbody>` groups. Move divider ownership from the column header to each group-heading row, and move shimmer ownership from the North Star `<tbody>` to its single metric row.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Jest, Testing Library

## Global Constraints

- Use `border-b-2 border-cm-wood` beneath `North Star`.
- Use `border-b-2 border-charcoal/25` beneath the other three group headings.
- Keep the existing shimmer gradient and animation, but apply them only to the ARPDAU metric row.
- Preserve all metric copy, tooltip behavior, column widths, typography, thin metric separators, and neutral North Star target color.
- Do not modify prototype or demo files.

---

### Task 1: Reassign group dividers and North Star shimmer

**Files:**
- Modify: `__tests__/ma-homeassignment.test.tsx`
- Modify: `app/MA-HomeAssignment/sections/MVP.tsx`

**Interfaces:**
- Consumes: `METRIC_GROUPS` and the existing unified `SuccessMetricsTable`
- Produces: four bordered group-heading rows and one shimmering ARPDAU metric row

- [ ] **Step 1: Update the regression test first**

In `renders success metrics as one grouped table with contextual funnel help`, replace the existing table-header and North Star shimmer assertions with:

```tsx
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
  expect(groups[0].className).not.toContain('animate-shimmer')
  expect(groups[0].getAttribute('style')).toBeNull()
  expect(northStarRow.className).toContain('animate-shimmer')
  expect(northStarRow.className).toContain('motion-reduce:animate-none')
  expect(northStarRow.getAttribute('style')).toContain(
    'linear-gradient(90deg, rgba(245,168,0,0.08) 0%, rgba(245,168,0,0.28) 50%, rgba(245,168,0,0.08) 100%)'
  )
  expect(northStarTarget.className).toContain('text-charcoal')
  expect(northStarTarget.className).not.toContain('text-cm-crimson')
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
npm.cmd test -- --runInBand __tests__/ma-homeassignment.test.tsx -t "renders success metrics as one grouped table with contextual funnel help"
```

Expected: FAIL because the column header still owns the wood divider and the North Star `<tbody>` still owns the shimmer.

- [ ] **Step 3: Apply the minimal table implementation**

In `SuccessMetricsTable`:

1. Remove `border-b-2 border-cm-wood` from the `<thead>` row.
2. Remove the conditional `className` and `style` from each `<tbody>`.
3. Give each group-heading row this class:

```tsx
className={`border-b-2 ${isNorthStar ? 'border-cm-wood' : 'border-charcoal/25'}`}
```

4. Inside the metrics map, compute:

```tsx
const isNorthStarMetric = isNorthStar && metric === 'ARPDAU'
```

5. Apply the existing shimmer class and gradient only when `isNorthStarMetric` is true:

```tsx
className={`border-b border-charcoal/15 last:border-b-0 ${isNorthStarMetric ? 'animate-shimmer motion-reduce:animate-none' : ''}`}
style={isNorthStarMetric ? {
  backgroundImage: 'linear-gradient(90deg, rgba(245,168,0,0.08) 0%, rgba(245,168,0,0.28) 50%, rgba(245,168,0,0.08) 100%)',
  backgroundSize: '200% 100%',
} : undefined}
```

- [ ] **Step 4: Run the focused assignment suite and verify GREEN**

Run:

```powershell
npm.cmd test -- --runInBand __tests__/ma-homeassignment.test.tsx
```

Expected: all assignment tests pass.

- [ ] **Step 5: Run full verification**

Run:

```powershell
npm.cmd test -- --runInBand
npm.cmd run build
git diff --check
```

Expected: all Jest suites pass, the production build exits 0, and no whitespace errors are reported.

- [ ] **Step 6: Verify rendered table behavior**

At desktop and mobile widths, confirm the wood divider is beneath `North Star`, the other group headings use charcoal dividers, and the animated gradient is computed only on the ARPDAU row. Confirm no table overflow or browser console errors.

- [ ] **Step 7: Commit**

```powershell
git add -- '__tests__/ma-homeassignment.test.tsx' 'app/MA-HomeAssignment/sections/MVP.tsx'
git commit -m "style: refine success metric hierarchy"
```
