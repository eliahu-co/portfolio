# Intro Copy and Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the approved intro sentence and align the intro content's right edge with the full feature-content column.

**Architecture:** Keep the change local to the existing `Intro` component. Extend the assignment regression suite to assert the exact copy and removal of the wrapper width cap, then make the smallest class and text edits needed to satisfy those tests.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Jest, Testing Library

## Global Constraints

- Use this exact sentence: `I developed three concepts, each targeting a different path to ARPDAU growth: a new spend surface, deeper spending or more purchase opportunities through re-engagement.`
- Remove `max-w-2xl` only from the `#hero` intro wrapper.
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
