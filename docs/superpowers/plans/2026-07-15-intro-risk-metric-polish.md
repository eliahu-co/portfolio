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
- The desktop Coin Master logo must be anchored to and vertically centered against the title row; the mobile logo remains unchanged.
- Assumptions must retain semantic list markup and existing copy while removing decorative em-dash markers and their horizontal gap.
- Do not modify or stage unrelated prototype/demo files already present in the worktree.

## File structure

- Modify `__tests__/ma-homeassignment.test.tsx`: add focused DOM class regressions for all three visual requirements.
- Modify `app/MA-HomeAssignment/sections/Intro.tsx`: align the opening paragraph's font-size utility with Concept copy.
- Modify `app/MA-HomeAssignment/sections/UseCase.tsx`: remove only the risk variant's background-gradient utilities.
- Modify `app/MA-HomeAssignment/sections/MVP.tsx`: give role pills the shared width and centered alignment.
- Modify `app/MA-HomeAssignment/sections/Hero.tsx`: anchor the desktop logo to a title-row wrapper.
- Modify `app/MA-HomeAssignment/sections/AssumptionsSources.tsx`: remove decorative marker spans and marker-only layout utilities.

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

### Task 4: Center the desktop logo against the title

**Files:**
- Test: `__tests__/ma-homeassignment.test.tsx`
- Modify: `app/MA-HomeAssignment/sections/Hero.tsx:22-51`

**Interfaces:**
- Consumes: the existing desktop-only and mobile-only Coin Master logo elements.
- Produces: a desktop title-row wrapper with the desktop logo vertically centered against the `<h1>`; the mobile logo remains unchanged.

- [ ] **Step 1: Write the failing test**

Extend the hero-banner test with:

```tsx
const desktopLogo = band.querySelector('img[data-hero-logo="desktop"]')!
const mobileLogo = band.querySelector('img[data-hero-logo="mobile"]')!
const titleRow = h1.parentElement!
expect(titleRow.dataset.heroTitleRow).toBe('true')
expect(titleRow).toContainElement(desktopLogo)
expect(desktopLogo.className).toContain('top-1/2')
expect(desktopLogo.className).toContain('-translate-y-1/2')
expect(mobileLogo.className).toContain('md:hidden')
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run `npm.cmd test -- __tests__\ma-homeassignment.test.tsx --runInBand`.

Expected: FAIL because the logo elements have no data attributes and the desktop logo is outside the title row.

- [ ] **Step 3: Write the minimal implementation**

Keep the eyebrow and mobile logo in their existing positions. Wrap the `<h1>` in:

```tsx
<div className="relative" data-hero-title-row="true">
```

Move the desktop image into that wrapper after the `<h1>`, add `data-hero-logo="desktop"`, and use:

```tsx
className="pointer-events-none absolute right-[60px] top-1/2 hidden h-[clamp(80px,10vw,112px)] w-auto -translate-y-1/2 drop-shadow-lg md:block"
```

Remove its old inline positioning style. Add `data-hero-logo="mobile"` to the mobile image without changing its classes or style.

- [ ] **Step 4: Run the focused test to verify it passes**

Run `npm.cmd test -- __tests__\ma-homeassignment.test.tsx --runInBand`.

Expected: all focused tests PASS.

### Task 5: Remove Assumptions markers

**Files:**
- Test: `__tests__/ma-homeassignment.test.tsx`
- Modify: `app/MA-HomeAssignment/sections/AssumptionsSources.tsx:19-24`

**Interfaces:**
- Consumes: the existing `ASSUMPTIONS` array and semantic `<ul>/<li>` structure.
- Produces: unchanged assumption copy rendered without decorative marker elements or em-dash text.

- [ ] **Step 1: Write the failing test**

Add:

```tsx
it('renders Assumptions without decorative dash markers', () => {
  render(<MAHomeAssignmentPage />)
  const assumptions = document.getElementById('assumptions')!
  const items = Array.from(assumptions.querySelectorAll('li'))

  expect(items).toHaveLength(6)
  for (const item of items) {
    expect(item.querySelector('[aria-hidden="true"]')).toBeNull()
    expect(item.textContent?.trim().startsWith('—')).toBe(false)
    expect(item.className).not.toContain('flex')
    expect(item.className).not.toContain('gap-2')
  }
})
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run `npm.cmd test -- __tests__\ma-homeassignment.test.tsx --runInBand`.

Expected: FAIL because every item still contains the em-dash marker and flex gap.

- [ ] **Step 3: Write the minimal implementation**

Render each item directly:

```tsx
<li key={i} className="font-sans text-[14px] leading-relaxed text-charcoal">
  {a}
</li>
```

- [ ] **Step 4: Run final focused verification and inspect the diff**

Run:

```powershell
npm.cmd test -- __tests__\ma-homeassignment.test.tsx --runInBand
git diff --check -- __tests__/ma-homeassignment.test.tsx app/MA-HomeAssignment/sections/Intro.tsx app/MA-HomeAssignment/sections/UseCase.tsx app/MA-HomeAssignment/sections/MVP.tsx app/MA-HomeAssignment/sections/Hero.tsx app/MA-HomeAssignment/sections/AssumptionsSources.tsx
```

Expected: all focused tests PASS and no whitespace errors are reported.
