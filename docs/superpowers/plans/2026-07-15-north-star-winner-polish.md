# North Star Winner Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Match the Success Metrics North Star styling to the Card Bounty winner row and remove red risk coloring from its target.

**Architecture:** Change only the conditional North Star classes and inline background style in `SuccessMetricsTable`. Update the existing assignment test to lock the exact winner gradient, absent left border, and charcoal target text.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Jest, Testing Library.

## Global Constraints

- Preserve all content, table structure, shimmer timing, and tooltip behavior.
- Use the exact Card Bounty winner gradient.
- Do not modify the prototype or demo.

---

### Task 1: North Star Winner Styling

**Files:**
- Modify: `__tests__/ma-homeassignment.test.tsx`
- Modify: `app/MA-HomeAssignment/sections/MVP.tsx`

**Interfaces:**
- Consumes: `SuccessMetricsTable()` and its `isNorthStar` conditional.
- Produces: a subdued animated North Star row group with charcoal target text.

- [ ] **Step 1: Write failing styling assertions**

Replace the solid-plaque expectations with:

```tsx
expect(groups[0].className).not.toContain('border-l-4')
expect(groups[0].className).not.toContain('border-[#C77F14]')
expect(groups[0].getAttribute('style')).toContain(
  'linear-gradient(90deg, rgba(245, 168, 0, 0.08) 0%, rgba(245, 168, 0, 0.28) 50%, rgba(245, 168, 0, 0.08) 100%)'
)
expect(groups[0].querySelector('tr[data-metric-row] td:last-child')?.className).toContain('text-charcoal')
expect(groups[0].querySelector('tr[data-metric-row] td:last-child')?.className).not.toContain('text-cm-crimson')
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm.cmd test -- --runInBand __tests__/ma-homeassignment.test.tsx`

Expected: FAIL on the existing border, solid yellow gradient, and crimson target.

- [ ] **Step 3: Apply the winner-row treatment**

Use the same conditional class and style as Card Bounty:

```tsx
className={isNorthStar ? 'animate-shimmer motion-reduce:animate-none' : ''}
style={isNorthStar ? {
  backgroundImage: 'linear-gradient(90deg, rgba(245,168,0,0.08) 0%, rgba(245,168,0,0.28) 50%, rgba(245,168,0,0.08) 100%)',
  backgroundSize: '200% 100%',
} : undefined}
```

Use `font-medium text-charcoal` for the North Star target.

- [ ] **Step 4: Run focused and full verification**

Run: `npm.cmd test -- --runInBand __tests__/ma-homeassignment.test.tsx`

Expected: 14 tests pass.

Run: `npm.cmd test -- --runInBand`

Expected: all suites pass.

Run: `npm.cmd run build`

Expected: production build compiles and type-checks.

- [ ] **Step 5: Inspect and commit**

Inspect the local North Star animation and verify no overflow or console errors.

```powershell
git add -- __tests__/ma-homeassignment.test.tsx app/MA-HomeAssignment/sections/MVP.tsx
git commit -m "style: soften North Star emphasis"
```
