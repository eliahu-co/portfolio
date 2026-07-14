# Intro, Risk Card, and Metric Pill Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Match the opening copy to the Concept typography, remove risk-card fills, and standardize Success metrics role-pill widths.

**Architecture:** Keep the existing component structure and Tailwind styling conventions. Make one class-level change in each responsible component and protect each result with DOM class assertions in the existing MA Home Assignment regression suite.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Jest, Testing Library

## Global Constraints

- The opening paragraph must use the Concept paragraph's exact `14px` font size.
- Risk cards must have no background fill or gradient; their borders, accent bars, spacing, typography, warning markers, layout, and shadows remain unchanged.
- Success metrics role pills must use a fixed `80px` width with horizontally centered labels.
- Existing role-specific fills, strokes, text colors, height, type styling, and table-cell alignment remain unchanged.
- Do not modify or stage unrelated prototype/demo files already present in the worktree.

## File structure

- Modify `__tests__/ma-homeassignment.test.tsx`: add focused DOM class regressions for all three visual requirements.
- Modify `app/MA-HomeAssignment/sections/Intro.tsx`: align the opening paragraph's font-size utility with Concept copy.
- Modify `app/MA-HomeAssignment/sections/UseCase.tsx`: remove only the risk variant's background-gradient utilities.
- Modify `app/MA-HomeAssignment/sections/MVP.tsx`: give role pills the shared width and centered alignment.

---

### Task 1: Align intro typography

**Files:**
- Test: `__tests__/ma-homeassignment.test.tsx`
- Modify: `app/MA-HomeAssignment/sections/Intro.tsx:11`

**Interfaces:**
- Consumes: the rendered MA Home Assignment page and existing Tailwind class strings.
- Produces: an opening paragraph whose font-size class matches the Concept paragraph at `text-[14px]`.

- [ ] **Step 1: Write the failing test**

Add this test after the hero-banner test:

```tsx
it('matches the intro body size to the Concept copy', () => {
  render(<MAHomeAssignmentPage />)
  const intro = Array.from(document.querySelectorAll('#hero p')).find((node) =>
    node.textContent?.startsWith('Coin Master’s core')
  )!
  const concept = Array.from(document.querySelectorAll('#feature-1 p')).find((node) =>
    node.textContent?.startsWith('Villages show progression')
  )!

  expect(concept.className).toContain('text-[14px]')
  expect(intro.className).toContain('text-[14px]')
  expect(intro.className).not.toContain('text-[15px]')
})
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run:

```powershell
npm.cmd test -- __tests__\ma-homeassignment.test.tsx --runInBand
```

Expected: FAIL because the intro paragraph still contains `text-[15px]` and does not contain `text-[14px]`.

- [ ] **Step 3: Write the minimal implementation**

In `Intro.tsx`, change only the font-size utility:

```tsx
<p className="font-sans text-[14px] leading-relaxed text-charcoal mb-8">
```

- [ ] **Step 4: Run the focused test to verify it passes**

Run:

```powershell
npm.cmd test -- __tests__\ma-homeassignment.test.tsx --runInBand
```

Expected: PASS for the intro typography regression and all other tests in this focused file.

### Task 2: Remove risk-card backgrounds

**Files:**
- Test: `__tests__/ma-homeassignment.test.tsx`
- Modify: `app/MA-HomeAssignment/sections/UseCase.tsx:216-223`

**Interfaces:**
- Consumes: `CardVariant = 'value' | 'risk' | 'neutral'` and the existing `Card` renderer.
- Produces: risk cards with an empty surface-class branch while neutral-card behavior remains unchanged.

- [ ] **Step 1: Write the failing test**

Add this test after the feature mockup test:

```tsx
it('renders risk cards without a background fill', () => {
  render(<MAHomeAssignmentPage />)
  const riskTitle = Array.from(document.querySelectorAll('#feature-1 p')).find((node) =>
    node.textContent === 'Core Cannibalization'
  )!
  const riskCard = riskTitle.parentElement!

  expect(riskCard.className).toContain('border-cm-crimson/35')
  expect(riskCard.className).toContain('shadow-[')
  expect(riskCard.className).not.toContain('bg-')
  expect(riskCard.className).not.toContain('from-[')
  expect(riskCard.className).not.toContain('to-[')
})
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run:

```powershell
npm.cmd test -- __tests__\ma-homeassignment.test.tsx --runInBand
```

Expected: FAIL because the risk card contains `bg-gradient-to-b`, `from-[#FFF4F1]`, and `to-[#FBE9E7]`.

- [ ] **Step 3: Write the minimal implementation**

In the `surface` expression, keep the neutral gradient and return an empty string for both value and risk variants:

```tsx
const surface = variant === 'neutral'
  ? 'bg-gradient-to-b from-[#FBF7F0] to-[#F3ECDF]'
  : ''
```

Do not change `edge`, `span`, or the card wrapper's border, padding, radius, and shadow utilities.

- [ ] **Step 4: Run the focused test to verify it passes**

Run:

```powershell
npm.cmd test -- __tests__\ma-homeassignment.test.tsx --runInBand
```

Expected: PASS for the risk-card regression and all other tests in this focused file.

### Task 3: Standardize and center role pills

**Files:**
- Test: `__tests__/ma-homeassignment.test.tsx:190-240`
- Modify: `app/MA-HomeAssignment/sections/MVP.tsx:126`

**Interfaces:**
- Consumes: the existing `METRICS` rows and `ROLE_CLASSES` color mapping.
- Produces: every rendered role pill with `w-20` (`80px`), `justify-center`, and unchanged role-specific presentation.

- [ ] **Step 1: Extend the existing failing table test**

After `expect(rolePills).toHaveLength(8)`, replace the one-line border loop with:

```tsx
for (const pill of rolePills) {
  expect(pill.className).toContain('border')
  expect(pill.className).toContain('w-20')
  expect(pill.className).toContain('justify-center')
}
```

Keep all existing role-specific border-color assertions.

- [ ] **Step 2: Run the focused test to verify it fails**

Run:

```powershell
npm.cmd test -- __tests__\ma-homeassignment.test.tsx --runInBand
```

Expected: FAIL because the role pills do not yet contain `w-20` or `justify-center`.

- [ ] **Step 3: Write the minimal implementation**

Update the role-pill shared classes in `MVP.tsx`:

```tsx
<span className={`inline-flex w-20 justify-center rounded-full border px-2 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.08em] ${ROLE_CLASSES[role]}`}>{role}</span>
```

- [ ] **Step 4: Run focused verification**

Run:

```powershell
npm.cmd test -- __tests__\ma-homeassignment.test.tsx --runInBand
```

Expected: all tests in `__tests__/ma-homeassignment.test.tsx` PASS.

- [ ] **Step 5: Inspect the scoped diff**

Run:

```powershell
git diff --check -- __tests__/ma-homeassignment.test.tsx app/MA-HomeAssignment/sections/Intro.tsx app/MA-HomeAssignment/sections/UseCase.tsx app/MA-HomeAssignment/sections/MVP.tsx
git diff -- __tests__/ma-homeassignment.test.tsx app/MA-HomeAssignment/sections/Intro.tsx app/MA-HomeAssignment/sections/UseCase.tsx app/MA-HomeAssignment/sections/MVP.tsx
```

Expected: no whitespace errors; the diff contains only the approved MA Home Assignment refinements, including the already-approved metrics intro and bordered-pill changes currently in `MVP.tsx` and its regression test.

- [ ] **Step 6: Commit only the scoped files**

```powershell
git add -- __tests__/ma-homeassignment.test.tsx app/MA-HomeAssignment/sections/Intro.tsx app/MA-HomeAssignment/sections/UseCase.tsx app/MA-HomeAssignment/sections/MVP.tsx docs/superpowers/plans/2026-07-15-intro-risk-metric-polish.md docs/superpowers/plans/2026-07-15-success-metrics-table.md
git commit -m "style: refine assignment typography and metrics"
```

Expected: the commit succeeds without staging any files under `app/MA-HomeAssignment/demo/` or the unrelated Card Bounty final-polish documents.
