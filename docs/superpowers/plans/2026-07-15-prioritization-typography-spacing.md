# Prioritization Typography and Spacing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the prioritization criterion labels and Opportunity Score formula with body typography and match the feature sections' bottom spacing.

**Architecture:** Keep the change local to `Prioritization.tsx`. A focused DOM regression test in the existing assignment suite will verify the typography classes, grey text color, retained accent classes, and `mb-6` spacing contract.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Jest, Testing Library

## Global Constraints

- Criterion label text and the Opportunity Score formula use `font-sans text-[14px] font-normal text-charcoal`.
- Criterion triangle arrows, wood left borders, and the formula gold left border remain unchanged.
- The outer criteria block uses `mb-6`.
- The scoring-method wrapper uses `gap-3 mb-3` so the final sentence has symmetrical 12px spacing.
- The shared `Section` component and unrelated sections do not change.

---

### Task 1: Prioritization typography and bottom rhythm

**Files:**
- Modify: `__tests__/ma-homeassignment.test.tsx`
- Modify: `app/MA-HomeAssignment/sections/Prioritization.tsx`

**Interfaces:**
- Consumes: the existing `Prioritization` DOM rendered through `MAHomeAssignmentPage`
- Produces: unchanged component API with updated Tailwind presentation classes

- [ ] **Step 1: Write the failing regression test**

Append this test to `__tests__/ma-homeassignment.test.tsx`:

```tsx
it('uses body typography and feature-section bottom spacing for prioritization criteria', () => {
  render(<MAHomeAssignmentPage />)
  const section = document.getElementById('prioritization')!
  const formula = Array.from(section.querySelectorAll('p')).find((node) =>
    node.textContent?.startsWith('Opportunity Score =')
  )!
  const calculationSummary = Array.from(section.querySelectorAll('p')).find((node) =>
    node.textContent?.startsWith('The calculation favors opportunities')
  )!
  const scoringMethod = calculationSummary.parentElement!
  const criteriaButtons = Array.from(section.querySelectorAll('button[aria-expanded]'))
  const criteriaWrapper = criteriaButtons[0].parentElement?.parentElement

  expect(formula.className).toContain('font-sans')
  expect(formula.className).toContain('text-[14px]')
  expect(formula.className).toContain('font-normal')
  expect(formula.className).toContain('text-charcoal')
  expect(formula.className).toContain('border-cm-gold')
  expect(scoringMethod.className).toContain('gap-3')
  expect(scoringMethod.className).toContain('mb-3')
  expect(scoringMethod.className).not.toContain('mb-8')

  expect(criteriaButtons).toHaveLength(4)
  for (const button of criteriaButtons) {
    const arrow = button.querySelector('span[aria-hidden="true"]')!
    const label = button.querySelector('span:not([aria-hidden])')!
    expect(label.className).toContain('font-sans')
    expect(label.className).toContain('text-[14px]')
    expect(label.className).toContain('font-normal')
    expect(label.className).toContain('text-charcoal')
    expect(arrow.className).toContain('text-cm-wood/60')
    expect(button.className).toContain('border-cm-wood')
  }

  expect(criteriaWrapper?.className).toContain('mb-6')
})
```

- [ ] **Step 2: Run the targeted test and verify RED**

Run:

```powershell
npm.cmd test -- __tests__/ma-homeassignment.test.tsx --runInBand
```

Expected: FAIL because the formula is `text-[13px] font-bold text-cm-violet-deep`, the criterion labels use serif violet styling, and the criteria wrapper lacks `mb-6`.

- [ ] **Step 3: Apply the minimal presentation changes**

In `app/MA-HomeAssignment/sections/Prioritization.tsx`, change the formula class to:

```tsx
className="font-sans text-[14px] font-normal leading-relaxed text-charcoal border-l-4 border-cm-gold pl-3"
```

Change the outer criteria wrapper from `<div>` to:

```tsx
<div className="mb-6">
```

Change the scoring-method wrapper to:

```tsx
<div className="max-w-2xl mb-3 flex flex-col gap-3">
```

Change each criterion label span to:

```tsx
<span className="font-sans text-[14px] font-normal text-charcoal">{title}</span>
```

Do not alter the arrow span or button border classes.

- [ ] **Step 4: Run the targeted test and verify GREEN**

Run:

```powershell
npm.cmd test -- __tests__/ma-homeassignment.test.tsx --runInBand
```

Expected: PASS with all tests in the file passing.

- [ ] **Step 5: Run complete verification**

Run:

```powershell
npm.cmd test -- --runInBand
npm.cmd run build
```

Expected: all Jest suites pass and the Next.js production build exits successfully.

- [ ] **Step 6: Commit the implementation**

```powershell
git add __tests__/ma-homeassignment.test.tsx app/MA-HomeAssignment/sections/Prioritization.tsx docs/superpowers/plans/2026-07-15-prioritization-typography-spacing.md
git commit -m "style(ma-homeassignment): align prioritization typography and spacing"
```
