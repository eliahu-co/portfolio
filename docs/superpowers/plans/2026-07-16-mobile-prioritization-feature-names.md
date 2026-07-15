# Mobile Prioritization Feature Names Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep all prioritization-table feature names on one line at mobile widths.

**Architecture:** Add an explicit test hook and no-wrap utility to the feature-name content in the existing prioritization table. Preserve the current table container, scoring columns, typography, and horizontal scrolling.

**Tech Stack:** Next.js 14, React, TypeScript, Tailwind CSS, Jest, Testing Library

## Global Constraints

- Keep every feature name full-size and unbroken.
- Preserve the current typography, row styling, winner treatment, and horizontal-scroll behavior.
- Do not abbreviate feature names or shrink their text.

---

### Task 1: Keep Feature Names on One Line

**Files:**
- Modify: `__tests__/ma-homeassignment.test.tsx`
- Modify: `app/MA-HomeAssignment/sections/Prioritization.tsx`

**Interfaces:**
- Consumes: the existing `ROWS` data and prioritization-table row rendering.
- Produces: `[data-prioritization-feature]` labels with Tailwind's `whitespace-nowrap` behavior.

- [x] **Step 1: Write the failing regression assertion**

Add this focused behavior check inside the prioritization test:

```tsx
const featureLabels = Array.from(section.querySelectorAll('[data-prioritization-feature]'))
expect(featureLabels.map((label) => label.textContent?.trim())).toEqual([
  '🥇Card Bounty',
  '🥈Hot Trail',
  '🥉Hometown',
])
featureLabels.forEach((label) => expect(label.className).toContain('whitespace-nowrap'))
```

- [x] **Step 2: Run the focused test and verify the assertion fails**

Run:

```powershell
npm.cmd test -- --runInBand __tests__/ma-homeassignment.test.tsx -t "scoring definitions"
```

Expected: FAIL because no elements match `[data-prioritization-feature]`.

- [x] **Step 3: Add the minimal no-wrap label**

Wrap the existing medal and feature name inside the first cell:

```tsx
<span data-prioritization-feature className="inline-flex items-center whitespace-nowrap">
  {medal && <span className="mr-1.5" aria-hidden="true">{medal}</span>}
  {row.useCase}
</span>
```

- [x] **Step 4: Verify the focused test passes**

Run:

```powershell
npm.cmd test -- --runInBand __tests__/ma-homeassignment.test.tsx -t "scoring definitions"
```

Expected: PASS.

- [x] **Step 5: Verify responsive behavior and the full project**

At a mobile viewport, confirm `Card Bounty` and `Hot Trail` remain on one line, the table remains horizontally scrollable, and the document itself has no horizontal overflow. Then run:

```powershell
npm.cmd test -- --runInBand
npx.cmd tsc --noEmit --incremental false
git diff --check
```

Expected: all 23 suites and 156 or more tests pass, TypeScript exits 0, and `git diff --check` reports no errors.

- [x] **Step 6: Commit the implementation**

```powershell
git add -- __tests__/ma-homeassignment.test.tsx app/MA-HomeAssignment/sections/Prioritization.tsx docs/superpowers/plans/2026-07-16-mobile-prioritization-feature-names.md
git commit -m "keep prioritization feature names on one line"
```
