# Intro Research Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the intro research-framing paragraph with the exact approved concise copy.

**Architecture:** Keep the change inside the existing `Intro` component. Extend the assignment regression suite with an exact-text assertion, then replace only the paragraph contents.

**Tech Stack:** Next.js 14, React 18, TypeScript, Jest, Testing Library

## Global Constraints

- Use the exact approved paragraph from the design spec.
- Preserve the existing paragraph classes, position, spacing, and typography.
- Do not modify any other copy, layout, prototype, or demo files.

---

### Task 1: Replace the research-framing paragraph

**Files:**
- Modify: `__tests__/ma-homeassignment.test.tsx`
- Modify: `app/MA-HomeAssignment/sections/Intro.tsx`

**Interfaces:**
- Consumes: the existing `Intro` component rendered by `MAHomeAssignmentPage`
- Produces: the approved research paragraph in the same paragraph element

- [ ] **Step 1: Write the failing regression test**

```tsx
it('renders the approved intro research copy', () => {
  render(<MAHomeAssignmentPage />)
  const intro = document.getElementById('hero')!
  const research = Array.from(intro.querySelectorAll('p')).find((node) =>
    node.textContent?.startsWith('I used official support pages')
  )

  expect(research?.textContent).toBe(
    'I used official support pages, advanced gameplay, player communities and industry analysis to cover systems that I had not reached yet. I compared Coin Master with Monopoly GO! and Dice Dreams, then reviewed Royal Match and Whiteout Survival for transferable collection, guarantee, customization, social, PvP and LiveOps mechanics.'
  )
  expect(intro.textContent).not.toContain('Using this map, I looked for ARPDAU opportunities')
  expect(intro.textContent).not.toContain('I played Coin Master with a product lens')
})
```

- [ ] **Step 2: Run the test and verify RED**

```powershell
npm.cmd test -- --runInBand __tests__/ma-homeassignment.test.tsx -t "renders the approved intro research copy"
```

Expected: FAIL because no paragraph starts with the approved copy.

- [ ] **Step 3: Replace only the paragraph contents**

```tsx
<p className="font-sans pt-3 text-[14px] leading-relaxed text-charcoal">
  I used official support pages, advanced gameplay, player communities and industry analysis to
  cover systems that I had not reached yet. I compared Coin Master with Monopoly GO! and Dice
  Dreams, then reviewed Royal Match and Whiteout Survival for transferable collection, guarantee,
  customization, social, PvP and LiveOps mechanics.
</p>
```

- [ ] **Step 4: Run the focused suite and verify GREEN**

```powershell
npm.cmd test -- --runInBand __tests__/ma-homeassignment.test.tsx
```

Expected: all assignment tests pass.

- [ ] **Step 5: Run full verification**

```powershell
npm.cmd test -- --runInBand
npm.cmd run build
git diff --check
```

Expected: all tests pass, the production build exits 0, and no whitespace errors are reported.

- [ ] **Step 6: Commit**

```powershell
git add -- '__tests__/ma-homeassignment.test.tsx' 'app/MA-HomeAssignment/sections/Intro.tsx'
git commit -m "copy: tighten intro research framing"
```
