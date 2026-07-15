# Intro Copy and Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the approved intro sentence and align both the intro and hero header with the full feature-content column.

**Architecture:** Keep the changes local to the existing `Intro` and `Hero` components. Extend the assignment regression suite to assert the exact copy, removal of both width caps, and the logo's right-edge position while explicitly preserving its current sizing classes.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Jest, Testing Library

## Global Constraints

- Use this exact sentence: `I developed three concepts, each targeting a different path to ARPDAU growth: a new spend surface, deeper spending or more purchase opportunities through re-engagement.`
- Remove `max-w-2xl` only from the `#hero` intro wrapper.
- Position the desktop hero logo with `right-0` instead of `right-[60px]`.
- Remove `max-w-2xl` from the hero contact row.
- Preserve the desktop logo's existing `h-[clamp(80px,10vw,112px)]` sizing at every breakpoint.
- Preserve typography, vertical spacing, page padding, navigation, and all other section layouts.
- Do not modify files under `app/MA-HomeAssignment/demo/`.
- Preserve the existing mobile layout and avoid horizontal overflow.

---

### Task 1: Update intro copy and width

**Files:**
- Modify: `__tests__/ma-homeassignment.test.tsx`
- Modify: `app/MA-HomeAssignment/sections/Intro.tsx`

**Interfaces:**
- Consumes: the existing `Intro` component rendered inside `MAHomeAssignmentPage`
- Produces: an intro wrapper that fills the available main column and contains the exact approved closing sentence

- [ ] **Step 1: Write the failing regression test**

Add this test to `__tests__/ma-homeassignment.test.tsx` after the existing intro typography test:

```tsx
it('renders the approved intro framing copy at the full content width', () => {
  render(<MAHomeAssignmentPage />)
  const intro = document.getElementById('hero')!
  const framing = Array.from(intro.querySelectorAll('p')).find((node) =>
    node.textContent?.startsWith('I developed three concepts')
  )!

  expect(framing.textContent).toBe(
    'I developed three concepts, each targeting a different path to ARPDAU growth: a new spend surface, deeper spending or more purchase opportunities through re-engagement.'
  )
  expect(intro.className).not.toContain('max-w-2xl')
})
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
npm.cmd test -- --runInBand __tests__/ma-homeassignment.test.tsx -t "renders the approved intro framing copy at the full content width"
```

Expected: FAIL because the old sentence is rendered and the intro wrapper still contains `max-w-2xl`.

- [ ] **Step 3: Apply the minimal implementation**

In `app/MA-HomeAssignment/sections/Intro.tsx`, change the wrapper to:

```tsx
<div id="hero" className="scroll-mt-8 mb-14">
```

Replace the closing paragraph content with:

```tsx
<p className="font-sans mt-4 text-[14px] leading-relaxed text-charcoal">
  I developed three concepts, each targeting a different path to ARPDAU growth: a new spend
  surface, deeper spending or more purchase opportunities through re-engagement.
</p>
```

- [ ] **Step 4: Run the focused assignment suite and verify GREEN**

Run:

```powershell
npm.cmd test -- --runInBand __tests__/ma-homeassignment.test.tsx
```

Expected: the assignment suite passes with no failures.

- [ ] **Step 5: Run repository verification**

Run:

```powershell
npm.cmd test -- --runInBand
npm.cmd run build
git diff --check
```

Expected: all Jest suites pass, the Next.js production build exits 0, and `git diff --check` reports no whitespace errors.

- [ ] **Step 6: Verify responsive layout**

At a 1440px desktop viewport, confirm the `#hero` and `main` bounding rectangles have the same left edge, right edge, and width. At a 390px mobile viewport, confirm the same alignment and verify `document.documentElement.scrollWidth <= window.innerWidth`.

- [ ] **Step 7: Commit the implementation**

```powershell
git add -- '__tests__/ma-homeassignment.test.tsx' 'app/MA-HomeAssignment/sections/Intro.tsx'
git commit -m "fix: align intro content width"
```

---

### Task 2: Align the hero logo and contact row

**Files:**
- Modify: `__tests__/ma-homeassignment.test.tsx`
- Modify: `app/MA-HomeAssignment/sections/Hero.tsx`

**Interfaces:**
- Consumes: the existing `Hero` component rendered inside `MAHomeAssignmentPage`
- Produces: a desktop logo and contact row whose right edges align with the shared content column, without changing logo size

- [ ] **Step 1: Write the failing hero-alignment test**

Add this test after `renders the Coin Master hero banner` in `__tests__/ma-homeassignment.test.tsx`:

```tsx
it('aligns hero content to the full column without resizing the logo', () => {
  render(<MAHomeAssignmentPage />)
  const hero = document.getElementById('top')!
  const logo = hero.querySelector('img[data-hero-logo="desktop"]')!
  const contactRow = Array.from(hero.querySelectorAll('p')).find((node) =>
    node.querySelector('a[href^="tel:"]')
  )!

  expect(logo.className).toContain('right-0')
  expect(logo.className).not.toContain('right-[60px]')
  expect(logo.className).toContain('h-[clamp(80px,10vw,112px)]')
  expect(contactRow.className).not.toContain('max-w-2xl')
})
```

- [ ] **Step 2: Run the hero test and verify RED**

Run:

```powershell
npm.cmd test -- --runInBand __tests__/ma-homeassignment.test.tsx -t "aligns hero content to the full column without resizing the logo"
```

Expected: FAIL because the logo still uses `right-[60px]` and the contact row still uses `max-w-2xl`.

- [ ] **Step 3: Apply the minimal hero implementation**

In `app/MA-HomeAssignment/sections/Hero.tsx`, change the desktop logo class to:

```tsx
className="pointer-events-none absolute right-0 top-[calc(50%_-_6px)] hidden h-[clamp(80px,10vw,112px)] w-auto -translate-y-1/2 drop-shadow-lg md:block"
```

Change the contact row class to:

```tsx
className="font-sans text-[11px] uppercase tracking-[0.12em] text-[#0F3D54] border-t-2 border-[#0F3D54]/25 pt-3 flex flex-wrap items-baseline justify-center md:justify-between gap-x-6 gap-y-1"
```

- [ ] **Step 4: Run the focused assignment suite and verify GREEN**

Run:

```powershell
npm.cmd test -- --runInBand __tests__/ma-homeassignment.test.tsx
```

Expected: all assignment tests pass.

- [ ] **Step 5: Run repository verification**

Run:

```powershell
npm.cmd test -- --runInBand
npm.cmd run build
git diff --check
```

Expected: all Jest suites pass, the Next.js production build exits 0, and `git diff --check` reports no whitespace errors.

- [ ] **Step 6: Verify responsive layout**

At a 1440px viewport, confirm the `#hero` intro wrapper, desktop logo right edge, contact-row right edge, and `main` right edge are equal. At a 390px viewport, confirm no horizontal overflow. Do not resize the logo during this verification.

- [ ] **Step 7: Commit the hero implementation**

```powershell
git add -- '__tests__/ma-homeassignment.test.tsx' 'app/MA-HomeAssignment/sections/Hero.tsx'
git commit -m "fix: align hero content width"
```
